import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCompany, updateCompany } from "@/api/companies";
import { uploadImage } from "@/api/upload";
import { useSecteurs } from "@/contexts/SecteurContext";
import FormField from "@/components/ui/FormField/FormField";
import styles from "./EditEntreprisePage.module.scss";

import AddIcon    from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/RemoveCircleOutlined";
import ArrowBack  from "@mui/icons-material/ArrowBack";
import PhotoIcon  from "@mui/icons-material/AddPhotoAlternateOutlined";

const SIZES = [
    { value: "",    label: "Sélectionner une taille" },
    { value: "TPE", label: "TPE (< 10 employés)" },
    { value: "PME", label: "PME (10–249 employés)" },
    { value: "ETI", label: "ETI (250–4999 employés)" },
    { value: "GE",  label: "Grande Entreprise (5000+)" },
];

const PROVINCES = [
    { value: "",               label: "Sélectionner une province" },
    { value: "Liège",          label: "Liège" },
    { value: "Namur",          label: "Namur" },
    { value: "Luxembourg",     label: "Luxembourg" },
    { value: "Hainaut",        label: "Hainaut" },
    { value: "Brabant Wallon", label: "Brabant Wallon" },
    { value: "Bruxelles",      label: "Bruxelles" },
    { value: "Brabant Flamand",label: "Brabant Flamand" },
    { value: "Anvers",         label: "Anvers" },
    { value: "Gand",           label: "Gand" },
];

const emptyContact = () => ({ name: "", email: "", phone: "" });

export default function EditEntreprisePage() {
    const { id }   = useParams();
    const navigate = useNavigate();
    const { sectors } = useSecteurs();
    const fileRef = useRef(null);

    const [loading,       setLoading]       = useState(true);
    const [submitting,    setSubmitting]     = useState(false);
    const [logoUploading, setLogoUploading] = useState(false);
    const [errors,        setErrors]        = useState({});

    const [form, setForm] = useState({
        name: "", sector: "", size: "", website: "", phone: "", description: "",
        street: "", city: "", postalCode: "", province: "", country: "",
        locationType: "belgique", logo: null,
        offresObservation: false, offres3e: false,
    });
    const [contacts, setContacts] = useState([emptyContact()]);

    useEffect(() => {
        getCompany(id)
            .then((c) => {
                const hasProvince = !!c.address?.province;
                setForm({
                    name:        c.name ?? "",
                    sector:      c.sectorId ?? "",
                    size:        c.size ?? "",
                    website:     c.website ?? "",
                    phone:       c.phone ?? "",
                    description: c.description ?? "",
                    street:      c.address?.street ?? "",
                    city:        c.address?.city ?? "",
                    postalCode:  c.address?.postalCode ?? "",
                    province:    c.address?.province ?? "",
                    country:     c.address?.country ?? "",
                    locationType: hasProvince ? "belgique" : "autre",
                    logo:        c.logo ?? null,
                    offresObservation: c.offresObservation ?? false,
                    offres3e:    c.offres3e ?? false,
                });
                if (c.contact) setContacts([{ name: c.contact.name ?? "", email: c.contact.email ?? "", phone: c.contact.phone ?? "" }]);
            })
            .catch(() => navigate("/entreprises"))
            .finally(() => setLoading(false));
    }, [id, navigate]);

    const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
    const toggle = (key) => () => setForm((f) => ({ ...f, [key]: !f[key] }));

    async function handleLogoChange(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        setLogoUploading(true);
        try {
            const url = await uploadImage(file);
            setForm((f) => ({ ...f, logo: url }));
        } catch { /* ignore */ }
        finally { setLogoUploading(false); }
    }

    function setContact(i, key, value) {
        setContacts((prev) => prev.map((c, idx) => idx === i ? { ...c, [key]: value } : c));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!form.name.trim()) { setErrors({ name: "Le nom est requis." }); return; }
        setSubmitting(true);
        setErrors({});
        try {
            await updateCompany(id, {
                name:        form.name,
                description: form.description || undefined,
                sector:      form.sector || undefined,
                size:        form.size || undefined,
                website:     form.website || undefined,
                phone:       form.phone || undefined,
                logo:        form.logo || undefined,
                address: {
                    street:     form.street || undefined,
                    city:       form.city || undefined,
                    postalCode: form.postalCode || undefined,
                    province:   form.locationType === "belgique" ? (form.province || undefined) : undefined,
                    country:    form.locationType === "belgique" ? "Belgique" : (form.country || undefined),
                },
                contactPerson: contacts.filter((c) => c.name.trim()).map((c) => ({
                    name: c.name, email: c.email || undefined, phone: c.phone || undefined,
                }))[0],
                offresObservation: form.offresObservation,
                offres3e:          form.offres3e,
            });
            navigate("/entreprises");
        } catch (err) {
            setErrors({ global: err.response?.data?.error ?? "Une erreur est survenue." });
        } finally {
            setSubmitting(false);
        }
    }

    const sectorOptions = [
        { value: "", label: "Sélectionner un secteur" },
        ...sectors.map((s) => ({ value: s._id, label: s.name })),
    ];

    if (loading) return <section><p style={{ padding: "40px", color: "var(--text)" }}>Chargement…</p></section>;

    return (
        <section>
            <div className="sectionHeader">
                <div className={styles.headerRow}>
                    <button className={styles.backBtn} onClick={() => navigate(-1)} type="button">
                        <ArrowBack fontSize="small" /> Retour
                    </button>
                    <h2>Modifier l'entreprise</h2>
                </div>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
                {errors.global && <p className={styles.error}>{errors.global}</p>}

                {/* Logo */}
                <div className={styles.logoSection}>
                    <input ref={fileRef} type="file" accept="image/*" className={styles.hiddenInput} onChange={handleLogoChange} />
                    <div className={styles.logoWrap} onClick={() => fileRef.current?.click()}>
                        {form.logo ? (
                            <img src={form.logo} alt="Logo" className={styles.logoImg} />
                        ) : (
                            <div className={styles.logoPlaceholder}>
                                <PhotoIcon />
                                <span>Logo</span>
                            </div>
                        )}
                        {logoUploading && <div className={styles.logoOverlay}>Envoi…</div>}
                    </div>
                </div>

                <div className={styles.row}>
                    <FormField label="Nom de l'entreprise" placeholder="EVS Broadcast Equipment" value={form.name} onChange={set("name")} error={errors.name} required />
                    <FormField label="Site web" placeholder="https://www.exemple.be" value={form.website} onChange={set("website")} />
                </div>
                <div className={styles.row}>
                    <FormField label="Secteur" type="select" value={form.sector} onChange={set("sector")} options={sectorOptions} />
                    <FormField label="Taille" type="select" value={form.size} onChange={set("size")} options={SIZES} />
                </div>
                <div className={styles.row}>
                    <FormField label="Téléphone" type="tel" placeholder="+32 4 66 00 00 00" value={form.phone} onChange={set("phone")} />
                </div>
                <FormField label="Description" type="textarea" placeholder="Décrivez l'entreprise…" value={form.description} onChange={set("description")} rows={3} />

                <p className={styles.groupLabel}>Adresse</p>
                <FormField label="Rue" placeholder="Rue de l'Informatique 1" value={form.street} onChange={set("street")} />
                <div className={styles.row}>
                    <FormField label="Ville" placeholder="Liège" value={form.city} onChange={set("city")} />
                    <FormField label="Code postal" placeholder="4000" value={form.postalCode} onChange={set("postalCode")} />
                </div>

                <div className={styles.fieldGroup}>
                    <p className={styles.groupLabel}>Lieu du stage</p>
                    <div className={styles.radioGroup}>
                        <label className={styles.radio}>
                            <input type="radio" name="locationType" value="belgique" checked={form.locationType === "belgique"} onChange={() => setForm((f) => ({ ...f, locationType: "belgique" }))} />
                            Belgique
                        </label>
                        <label className={styles.radio}>
                            <input type="radio" name="locationType" value="autre" checked={form.locationType === "autre"} onChange={() => setForm((f) => ({ ...f, locationType: "autre" }))} />
                            Autre pays
                        </label>
                    </div>
                    {form.locationType === "belgique" ? (
                        <FormField label="Province" type="select" value={form.province} onChange={set("province")} options={PROVINCES} />
                    ) : (
                        <FormField label="Pays" placeholder="France, Pays-Bas…" value={form.country} onChange={set("country")} />
                    )}
                </div>

                <div className={styles.sectionHeader}>
                    <p className={styles.groupLabel}>Contacts</p>
                    <button type="button" className={styles.addContactBtn} onClick={() => setContacts((p) => [...p, emptyContact()])}>
                        <AddIcon fontSize="small" /> Ajouter un contact
                    </button>
                </div>
                {contacts.map((contact, i) => (
                    <div key={i} className={styles.contactBlock}>
                        {contacts.length > 1 && (
                            <button type="button" className={styles.removeContactBtn} onClick={() => setContacts((p) => p.filter((_, idx) => idx !== i))}>
                                <RemoveIcon fontSize="small" />
                            </button>
                        )}
                        <div className={styles.row}>
                            <FormField label="Nom" placeholder="Prénom Nom" value={contact.name} onChange={(e) => setContact(i, "name", e.target.value)} />
                            <FormField label="E-mail" type="email" placeholder="contact@entreprise.be" value={contact.email} onChange={(e) => setContact(i, "email", e.target.value)} />
                        </div>
                        <FormField label="Téléphone" type="tel" placeholder="+32 4 66 00 00 00" value={contact.phone} onChange={(e) => setContact(i, "phone", e.target.value)} />
                    </div>
                ))}

                <div className={styles.checkboxRow}>
                    <label className={styles.checkbox}><input type="checkbox" checked={form.offresObservation} onChange={toggle("offresObservation")} /> Stage d'observation disponible</label>
                    <label className={styles.checkbox}><input type="checkbox" checked={form.offres3e} onChange={toggle("offres3e")} /> Stage BAC3 disponible</label>
                </div>

                <div className={styles.formFooter}>
                    <button type="button" className={styles.cancelBtn} onClick={() => navigate(-1)}>Annuler</button>
                    <button type="submit" className={styles.saveBtn} disabled={submitting}>{submitting ? "Enregistrement…" : "Enregistrer"}</button>
                </div>
            </form>
        </section>
    );
}
