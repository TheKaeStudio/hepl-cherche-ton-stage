import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { updateMe } from "@/api/users";
import Modal from "@/components/ui/Modal/Modal";
import Avatar from "@/components/ui/Avatar/Avatar";
import FormField from "@/components/ui/FormField/FormField";
import styles from "./ProfileModal.module.scss";

const ROLE_DISPLAY = {
    student:  "Étudiant",
    teacher:  "Enseignant",
    manager:  "Manager",
    admin:    "Administrateur",
};

export default function ProfileModal() {
    const navigate  = useNavigate();
    const { user, updateCurrentUser } = useAuth();

    const [form, setForm] = useState({
        firstname: user?.firstname ?? "",
        lastname:  user?.lastname  ?? "",
        phone:     user?.phone     ?? "",
    });
    const [saving,  setSaving]  = useState(false);
    const [success, setSuccess] = useState(false);
    const [error,   setError]   = useState(null);

    const displayName = `${form.firstname} ${form.lastname}`.trim() || user?.email;

    const set = (key) => (e) => {
        setSuccess(false);
        setForm((f) => ({ ...f, [key]: e.target.value }));
    };

    async function handleSave() {
        setSaving(true);
        setError(null);
        try {
            const updated = await updateMe({
                firstname: form.firstname.trim(),
                lastname:  form.lastname.trim(),
                phone:     form.phone.trim() || undefined,
            });
            updateCurrentUser(updated);
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.error ?? "Une erreur est survenue.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <Modal
            isOpen
            onClose={() => navigate(-1)}
            title="Mon profil"
            size="sm"
            footer={
                <div className={styles.footer}>
                    <button className={styles.cancelBtn} onClick={() => navigate(-1)} type="button">
                        Fermer
                    </button>
                    <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
                        {saving ? "Enregistrement…" : "Enregistrer"}
                    </button>
                </div>
            }
        >
            <div className={styles.content}>
                <div className={styles.avatarWrap}>
                    <Avatar name={displayName} size="xl" />
                </div>

                <div className={styles.readOnly}>
                    <span className={styles.roleTag}>{ROLE_DISPLAY[user?.role] ?? user?.role}</span>
                    {user?.group?.name && <span className={styles.group}>{user.group.name}</span>}
                </div>

                {error   && <p className={styles.error}>{error}</p>}
                {success && <p className={styles.success}>Profil mis à jour.</p>}

                <div className={styles.fields}>
                    <div className={styles.row}>
                        <FormField
                            label="Prénom"
                            value={form.firstname}
                            onChange={set("firstname")}
                        />
                        <FormField
                            label="Nom"
                            value={form.lastname}
                            onChange={set("lastname")}
                        />
                    </div>
                    <FormField
                        label="E-mail"
                        value={user?.email ?? ""}
                        disabled
                    />
                    <FormField
                        label="Téléphone"
                        value={form.phone}
                        onChange={set("phone")}
                        placeholder="0470 00 00 00"
                    />
                </div>
            </div>
        </Modal>
    );
}
