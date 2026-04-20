import { useState, useEffect } from "react";
import { updateUser } from "@/api/users";
import Modal from "@/components/ui/Modal/Modal";
import FormField from "@/components/ui/FormField/FormField";
import styles from "./EditUserModal.module.scss";

const ROLE_OPTIONS = [
    { value: "etudiant",   label: "Étudiant"       },
    { value: "enseignant", label: "Enseignant"      },
    { value: "manager",    label: "Manager"         },
    { value: "admin",      label: "Administrateur"  },
];

export default function EditUserModal({ user, onClose, onSave }) {
    const [form, setForm] = useState({ role: "" });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (user) {
            setForm({ role: user.role ?? "" });
            setErrors({});
        }
    }, [user]);

    const set = (key) => (e) =>
        setForm((f) => ({ ...f, [key]: e.target.value }));

    async function handleSubmit(ev) {
        ev.preventDefault();
        if (!form.role) { setErrors({ role: "Le rôle est requis." }); return; }

        setSubmitting(true);
        try {
            const updated = await updateUser(user.id, { role: form.role });
            onSave?.(updated);
            onClose();
        } catch (err) {
            setErrors({ global: err.response?.data?.error ?? "Une erreur est survenue." });
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Modal
            isOpen={!!user}
            onClose={onClose}
            title={`Modifier — ${user?.name ?? ""}`}
            size="sm"
            footer={
                <div className={styles.footer}>
                    <button className={styles.cancelBtn} onClick={onClose} type="button">
                        Annuler
                    </button>
                    <button className={styles.saveBtn} form="editUserForm" type="submit" disabled={submitting}>
                        {submitting ? "Enregistrement…" : "Enregistrer"}
                    </button>
                </div>
            }
        >
            <form id="editUserForm" onSubmit={handleSubmit} className={styles.form}>
                {errors.global && <p className={styles.error}>{errors.global}</p>}
                <FormField
                    label="Rôle"
                    type="select"
                    value={form.role}
                    onChange={set("role")}
                    options={ROLE_OPTIONS}
                    error={errors.role}
                    required
                />
            </form>
        </Modal>
    );
}
