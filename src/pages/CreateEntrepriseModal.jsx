import { useState } from "react";
import Modal from "@/components/ui/Modal/Modal";
import FormField from "@/components/ui/FormField/FormField";
import styles from "./CreateEntrepriseModal.module.scss";

const DOMAINS = [
    { value: "", label: "Sélectionner un domaine" },
    { value: "Informatique", label: "Informatique" },
    { value: "Agriculture", label: "Agriculture" },
    { value: "Commerce", label: "Commerce" },
    { value: "Industrie", label: "Industrie" },
];

const PROVINCES = [
    { value: "", label: "Sélectionner une province" },
    { value: "Liège", label: "Liège" },
    { value: "Namur", label: "Namur" },
    { value: "Luxembourg", label: "Luxembourg" },
    { value: "Hainaut", label: "Hainaut" },
    { value: "Brabant Wallon", label: "Brabant Wallon" },
];

const empty = {
    name: "", domain: "", province: "", description: "",
    contactName: "", contactEmail: "", contactPhone: "", website: "",
    offresObservation: false, offres3e: false,
};

export default function CreateEntrepriseModal({ isOpen, onClose, onSave }) {
    const [form, setForm] = useState(empty);
    const [errors, setErrors] = useState({});

    const set = (key) => (e) =>
        setForm((f) => ({ ...f, [key]: e.target.value }));

    const toggle = (key) => () =>
        setForm((f) => ({ ...f, [key]: !f[key] }));

    function validate() {
        const e = {};
        if (!form.name.trim()) e.name = "Le nom est requis.";
        if (!form.domain) e.domain = "Le domaine est requis.";
        if (!form.province) e.province = "La province est requise.";
        if (!form.contactName.trim()) e.contactName = "Le nom du contact est requis.";
        if (!form.contactEmail) e.contactEmail = "L'e-mail du contact est requis.";
        return e;
    }

    function handleSubmit(ev) {
        ev.preventDefault();
        const e = validate();
        if (Object.keys(e).length) { setErrors(e); return; }
        onSave?.(form);
        setForm(empty);
        setErrors({});
        onClose();
    }

    function handleClose() {
        setForm(empty);
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
                    <button className={styles.saveBtn} form="createEntrepriseForm" type="submit">
                        Enregistrer
                    </button>
                </div>
            }
        >
            <form id="createEntrepriseForm" onSubmit={handleSubmit} className={styles.form}>
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
                        placeholder="www.exemple.be"
                        value={form.website}
                        onChange={set("website")}
                    />
                </div>
                <div className={styles.row}>
                    <FormField
                        label="Domaine"
                        type="select"
                        value={form.domain}
                        onChange={set("domain")}
                        options={DOMAINS}
                        error={errors.domain}
                        required
                    />
                    <FormField
                        label="Province"
                        type="select"
                        value={form.province}
                        onChange={set("province")}
                        options={PROVINCES}
                        error={errors.province}
                        required
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
                <p className={styles.groupLabel}>Contact</p>
                <div className={styles.row}>
                    <FormField
                        label="Nom du contact"
                        placeholder="Prénom Nom"
                        value={form.contactName}
                        onChange={set("contactName")}
                        error={errors.contactName}
                        required
                    />
                    <FormField
                        label="E-mail du contact"
                        type="email"
                        placeholder="contact@entreprise.be"
                        value={form.contactEmail}
                        onChange={set("contactEmail")}
                        error={errors.contactEmail}
                        required
                    />
                </div>
                <FormField
                    label="Téléphone"
                    type="tel"
                    placeholder="+32 466 00 00 00"
                    value={form.contactPhone}
                    onChange={set("contactPhone")}
                />
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
