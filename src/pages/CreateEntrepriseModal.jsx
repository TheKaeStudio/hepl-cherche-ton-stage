import { useState } from "react";
import { useSecteurs } from "@/contexts/SecteurContext";
import { SIZES, PROVINCES } from "@/data/company";
import Modal from "@/components/ui/Modal/Modal";
import FormField from "@/components/ui/FormField/FormField";
import CustomRadio from "@/components/ui/CustomRadio/CustomRadio";
import CustomCheckbox from "@/components/ui/CustomCheckbox/CustomCheckbox";
import LogoUploadField from "@/components/ui/LogoUploadField/LogoUploadField";
import ContactsForm, { emptyContact } from "@/components/ui/ContactsForm/ContactsForm";
import styles from "./CreateEntrepriseModal.module.scss";

const empty = {
    name: "", sector: "", size: "", website: "", phone: "", description: "",
    street: "", city: "", postalCode: "", province: "", country: "",
    locationType: "belgique", logo: null,
    offresObservation: false, offres3e: false,
};

export default function CreateEntrepriseModal({ isOpen, onClose, onSave }) {
    const { sectors } = useSecteurs();

    const [form,       setForm]       = useState(empty);
    const [contacts,   setContacts]   = useState([emptyContact()]);
    const [errors,     setErrors]     = useState({});
    const [submitting, setSubmitting] = useState(false);

    const sectorOptions = [
        { value: "", label: "Aucun secteur" },
        ...sectors.map((s) => ({ value: s._id, label: s.name })),
    ];

    const set    = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
    const toggle = (key) => ()  => setForm((f) => ({ ...f, [key]: !f[key] }));

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

    function validate() {
        const e = {};
        if (!form.name.trim()) e.name = "Le nom est requis.";
        return e;
    }

    async function handleSubmit(ev) {
        ev.preventDefault();
        const e = validate();
        if (Object.keys(e).length) { setErrors(e); return; }

        const validContacts = contacts
            .filter((c) => c.name.trim())
            .map((c) => ({ name: c.name, email: c.email || undefined, phone: c.phone || undefined }));

        setSubmitting(true);
        try {
            await onSave?.({
                name:        form.name,
                description: form.description || undefined,
                sector:      form.sector || undefined,
                size:        form.size   || undefined,
                website:     form.website || undefined,
                phone:       form.phone  || undefined,
                logo:        form.logo   || undefined,
                address: {
                    street:     form.street     || undefined,
                    city:       form.city       || undefined,
                    postalCode: form.postalCode || undefined,
                    province:   form.locationType === "belgique" ? (form.province || undefined) : undefined,
                    country:    form.locationType === "belgique" ? "Belgique" : (form.country || undefined),
                },
                contactPerson:  validContacts[0] ?? undefined,
                contactPersons: validContacts.length > 0 ? validContacts : undefined,
                offresObservation: form.offresObservation,
                offres3e:          form.offres3e,
            });
            setForm(empty);
            setContacts([emptyContact()]);
            setErrors({});
            onClose();
        } catch (err) {
            setErrors({ global: err.response?.data?.error ?? "Une erreur est survenue." });
        } finally {
            setSubmitting(false);
        }
    }

    function handleClose() {
        setForm(empty);
        setContacts([emptyContact()]);
        setErrors({});
        onClose();
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Ajouter une entreprise"
            size="lg"
            footer={
                <div className={styles.footer}>
                    <button className={styles.cancelBtn} onClick={handleClose} type="button">Annuler</button>
                    <button className={styles.saveBtn} form="createEntrepriseForm" type="submit" disabled={submitting}>
                        {submitting ? "Enregistrement…" : "Enregistrer"}
                    </button>
                </div>
            }
        >
            <form id="createEntrepriseForm" onSubmit={handleSubmit} className={styles.form}>
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
                    <div className={styles.logoHint}>
                        <p className={styles.logoTitle}>Logo de l'entreprise</p>
                        <p className={styles.logoSub}>Cliquez pour uploader une image (max 5 Mo)</p>
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
                        <CustomRadio
                            name="locationType"
                            value="belgique"
                            checked={form.locationType === "belgique"}
                            onChange={() => setForm((f) => ({ ...f, locationType: "belgique" }))}
                        >
                            Belgique
                        </CustomRadio>
                        <CustomRadio
                            name="locationType"
                            value="autre"
                            checked={form.locationType === "autre"}
                            onChange={() => setForm((f) => ({ ...f, locationType: "autre" }))}
                        >
                            Autre pays
                        </CustomRadio>
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
                    <CustomCheckbox checked={form.offresObservation} onChange={toggle("offresObservation")}>
                        Stage d'observation disponible
                    </CustomCheckbox>
                    <CustomCheckbox checked={form.offres3e} onChange={toggle("offres3e")}>
                        Stage BAC3 disponible
                    </CustomCheckbox>
                </div>
            </form>
        </Modal>
    );
}
