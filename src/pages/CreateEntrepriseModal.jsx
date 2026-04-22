import { useState } from "react";
import { useSecteurs } from "@/contexts/SecteurContext";
import Modal from "@/components/ui/Modal/Modal";
import CompanyForm from "@/components/company/CompanyForm/CompanyForm";
import { emptyContact } from "@/components/ui/ContactsForm/ContactsForm";
import styles from "./CreateEntrepriseModal.module.scss";

const emptyForm = () => ({
    name: "", sector: "", size: "", website: "", phone: "", description: "",
    street: "", city: "", postalCode: "", province: "", country: "",
    locationType: "belgique", logo: null,
    offresObservation: false, offres3e: false,
});

export default function CreateEntrepriseModal({ isOpen, onClose, onSave }) {
    const { sectors } = useSecteurs();

    const [form,       setForm]       = useState(emptyForm);
    const [contacts,   setContacts]   = useState([emptyContact()]);
    const [errors,     setErrors]     = useState({});
    const [submitting, setSubmitting] = useState(false);

    const sectorOptions = [
        { value: "", label: "Aucun secteur" },
        ...sectors.map((s) => ({ value: s._id, label: s.name })),
    ];

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
                contact:  validContacts[0] ?? undefined,
                contacts: validContacts.length > 0 ? validContacts : undefined,
                offresObservation: form.offresObservation,
                offres3e:          form.offres3e,
            });
            setForm(emptyForm);
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
        setForm(emptyForm);
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
            <form id="createEntrepriseForm" onSubmit={handleSubmit}>
                {errors.global && <p className={styles.error}>{errors.global}</p>}
                <CompanyForm
                    form={form}
                    setForm={setForm}
                    contacts={contacts}
                    setContacts={setContacts}
                    errors={errors}
                    sectorOptions={sectorOptions}
                />
            </form>
        </Modal>
    );
}
