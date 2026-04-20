import { useState } from "react";
import Modal from "@/components/ui/Modal/Modal";
import FormField from "@/components/ui/FormField/FormField";
import styles from "./CreateEntrepriseModal.module.scss";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/RemoveCircleOutlined";

const DOMAINS = [
    { value: "", label: "Sélectionner un secteur" },
    { value: "Informatique", label: "Informatique" },
    { value: "Agriculture", label: "Agriculture" },
    { value: "Commerce", label: "Commerce" },
    { value: "Industrie", label: "Industrie" },
];

const SIZES = [
    { value: "", label: "Sélectionner une taille" },
    { value: "TPE", label: "TPE (< 10 employés)" },
    { value: "PME", label: "PME (10–249 employés)" },
    { value: "ETI", label: "ETI (250–4999 employés)" },
    { value: "GE", label: "Grande Entreprise (5000+)" },
];

const PROVINCES = [
    { value: "", label: "Sélectionner une province" },
    { value: "Liège", label: "Liège" },
    { value: "Namur", label: "Namur" },
    { value: "Luxembourg", label: "Luxembourg" },
    { value: "Hainaut", label: "Hainaut" },
    { value: "Brabant Wallon", label: "Brabant Wallon" },
    { value: "Bruxelles", label: "Bruxelles" },
    { value: "Brabant Flamand", label: "Brabant Flamand" },
    { value: "Anvers", label: "Anvers" },
    { value: "Gand", label: "Gand" },
];

const emptyContact = () => ({ name: "", email: "", phone: "" });

const empty = {
    name: "", sector: "", size: "", website: "", phone: "", description: "",
    street: "", city: "", postalCode: "", province: "", country: "Belgique",
    offresObservation: false, offres3e: false,
};

export default function CreateEntrepriseModal({ isOpen, onClose, onSave }) {
    const [form, setForm] = useState(empty);
    const [contacts, setContacts] = useState([emptyContact()]);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const set = (key) => (e) =>
        setForm((f) => ({ ...f, [key]: e.target.value }));

    const toggle = (key) => () =>
        setForm((f) => ({ ...f, [key]: !f[key] }));

    function setContact(index, key, value) {
        setContacts((prev) => prev.map((c, i) => i === index ? { ...c, [key]: value } : c));
    }

    function addContact() {
        setContacts((prev) => [...prev, emptyContact()]);
    }

    function removeContact(index) {
        setContacts((prev) => prev.filter((_, i) => i !== index));
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

        setSubmitting(true);
        try {
            await onSave?.({
                name:        form.name,
                description: form.description || undefined,
                sector:      form.sector || undefined,
                size:        form.size || undefined,
                website:     form.website || undefined,
                phone:       form.phone || undefined,
                address: {
                    street:     form.street || undefined,
                    city:       form.city || undefined,
                    postalCode: form.postalCode || undefined,
                    province:   form.province || undefined,
                    country:    form.country || "Belgique",
                },
                contactPerson: contacts.filter((c) => c.name.trim()).map((c) => ({
                    name:  c.name,
                    email: c.email || undefined,
                    phone: c.phone || undefined,
                }))[0],
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
                    <button className={styles.cancelBtn} onClick={handleClose} type="button">
                        Annuler
                    </button>
                    <button className={styles.saveBtn} form="createEntrepriseForm" type="submit" disabled={submitting}>
                        {submitting ? "Enregistrement…" : "Enregistrer"}
                    </button>
                </div>
            }
        >
            <form id="createEntrepriseForm" onSubmit={handleSubmit} className={styles.form}>
                {errors.global && <p className={styles.error}>{errors.global}</p>}

                <div className={styles.row}>
                    <FormField
                        label="Nom de l'entreprise"
                        placeholder="EVS Broadcast Equipment"
                        value={form.name}
                        onChange={set("name")}
                        error={errors.name}
                        required
                    />
                    <FormField
                        label="Site web"
                        placeholder="https://www.exemple.be"
                        value={form.website}
                        onChange={set("website")}
                    />
                </div>

                <div className={styles.row}>
                    <FormField
                        label="Secteur"
                        type="select"
                        value={form.sector}
                        onChange={set("sector")}
                        options={DOMAINS}
                    />
                    <FormField
                        label="Taille"
                        type="select"
                        value={form.size}
                        onChange={set("size")}
                        options={SIZES}
                    />
                </div>

                <div className={styles.row}>
                    <FormField
                        label="Téléphone"
                        type="tel"
                        placeholder="+32 4 66 00 00 00"
                        value={form.phone}
                        onChange={set("phone")}
                    />
                </div>

                <FormField
                    label="Description"
                    type="textarea"
                    placeholder="Décrivez l'entreprise..."
                    value={form.description}
                    onChange={set("description")}
                    rows={3}
                />

                <p className={styles.groupLabel}>Adresse</p>
                <FormField
                    label="Rue"
                    placeholder="Rue de l'Informatique 1"
                    value={form.street}
                    onChange={set("street")}
                />
                <div className={styles.row}>
                    <FormField
                        label="Ville"
                        placeholder="Liège"
                        value={form.city}
                        onChange={set("city")}
                    />
                    <FormField
                        label="Code postal"
                        placeholder="4000"
                        value={form.postalCode}
                        onChange={set("postalCode")}
                    />
                </div>
                <div className={styles.row}>
                    <FormField
                        label="Province"
                        type="select"
                        value={form.province}
                        onChange={set("province")}
                        options={PROVINCES}
                    />
                    <FormField
                        label="Pays"
                        placeholder="Belgique"
                        value={form.country}
                        onChange={set("country")}
                    />
                </div>

                <div className={styles.sectionHeader}>
                    <p className={styles.groupLabel}>Contacts</p>
                    <button type="button" className={styles.addContactBtn} onClick={addContact}>
                        <AddIcon fontSize="small" />
                        Ajouter un contact
                    </button>
                </div>
                {contacts.map((contact, i) => (
                    <div key={i} className={styles.contactBlock}>
                        {contacts.length > 1 && (
                            <button
                                type="button"
                                className={styles.removeContactBtn}
                                onClick={() => removeContact(i)}
                                title="Supprimer ce contact"
                            >
                                <RemoveIcon fontSize="small" />
                            </button>
                        )}
                        <div className={styles.row}>
                            <FormField
                                label="Nom"
                                placeholder="Prénom Nom"
                                value={contact.name}
                                onChange={(e) => setContact(i, "name", e.target.value)}
                            />
                            <FormField
                                label="E-mail"
                                type="email"
                                placeholder="contact@entreprise.be"
                                value={contact.email}
                                onChange={(e) => setContact(i, "email", e.target.value)}
                            />
                        </div>
                        <FormField
                            label="Téléphone"
                            type="tel"
                            placeholder="+32 4 66 00 00 00"
                            value={contact.phone}
                            onChange={(e) => setContact(i, "phone", e.target.value)}
                        />
                    </div>
                ))}

                <div className={styles.checkboxRow}>
                    <label className={styles.checkbox}>
                        <input
                            type="checkbox"
                            checked={form.offresObservation}
                            onChange={toggle("offresObservation")}
                        />
                        Stage d'observation disponible
                    </label>
                    <label className={styles.checkbox}>
                        <input
                            type="checkbox"
                            checked={form.offres3e}
                            onChange={toggle("offres3e")}
                        />
                        Stage BAC3 disponible
                    </label>
                </div>
            </form>
        </Modal>
    );
}
