import { useState, useEffect } from "react";
import { getUsers } from "@/api/users";
import { sendMessage } from "@/api/messages";
import Modal from "@/components/ui/Modal/Modal";
import FormField from "@/components/ui/FormField/FormField";
import styles from "./SendMessageModal.module.scss";

const empty = { recipient: "", subject: "", message: "" };

export default function SendMessageModal({ isOpen, onClose }) {
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState(empty);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        getUsers().then(setUsers).catch(() => {});
    }, [isOpen]);

    const recipientOptions = [
        { value: "", label: "Sélectionner un destinataire" },
        ...users.map((u) => ({ value: u.id, label: u.name })),
    ];

    const set = (key) => (e) =>
        setForm((f) => ({ ...f, [key]: e.target.value }));

    function validate() {
        const e = {};
        if (!form.recipient) e.recipient = "Veuillez choisir un destinataire.";
        if (!form.subject.trim()) e.subject = "L'objet est requis.";
        if (!form.message.trim()) e.message = "Le message est requis.";
        return e;
    }

    async function handleSubmit(ev) {
        ev.preventDefault();
        const e = validate();
        if (Object.keys(e).length) { setErrors(e); return; }
        setSubmitting(true);
        try {
            await sendMessage(form.recipient, form.subject, form.message);
            setForm(empty);
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
        setErrors({});
        onClose();
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Envoyer un message"
            size="md"
            footer={
                <div className={styles.footer}>
                    <button className={styles.cancelBtn} onClick={handleClose} type="button">
                        Annuler
                    </button>
                    <button className={styles.sendBtn} form="sendMessageForm" type="submit" disabled={submitting}>
                        {submitting ? "Envoi…" : "Envoyer"}
                    </button>
                </div>
            }
        >
            <form id="sendMessageForm" onSubmit={handleSubmit} className={styles.form}>
                {errors.global && <p className={styles.error}>{errors.global}</p>}
                <FormField
                    label="Destinataire"
                    type="select"
                    value={form.recipient}
                    onChange={set("recipient")}
                    options={recipientOptions}
                    error={errors.recipient}
                    required
                />
                <FormField
                    label="Objet"
                    placeholder="Sujet du message"
                    value={form.subject}
                    onChange={set("subject")}
                    error={errors.subject}
                    required
                />
                <FormField
                    label="Message"
                    type="textarea"
                    placeholder="Écrivez votre message..."
                    value={form.message}
                    onChange={set("message")}
                    error={errors.message}
                    rows={5}
                    required
                />
            </form>
        </Modal>
    );
}
