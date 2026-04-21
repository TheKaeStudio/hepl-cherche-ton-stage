import { useState, useEffect, useMemo } from "react";
import { getUsers } from "@/api/users";
import { getGroups } from "@/api/groups";
import { sendMessage } from "@/api/messages";
import Modal from "@/components/ui/Modal/Modal";
import FormField from "@/components/ui/FormField/FormField";
import UserPickerModal from "@/components/ui/UserPickerModal/UserPickerModal";
import styles from "./SendMessageModal.module.scss";

const empty = { subject: "", message: "" };

export default function SendMessageModal({ isOpen, onClose }) {
    const [recipientType, setRecipientType] = useState("user");
    const [selectedUser,  setSelectedUser]  = useState(null);
    const [selectedGroup, setSelectedGroup] = useState("");
    const [groups,        setGroups]        = useState([]);
    const [users,         setUsers]         = useState([]);
    const [form,          setForm]          = useState(empty);
    const [errors,        setErrors]        = useState({});
    const [submitting,    setSubmitting]    = useState(false);
    const [showPicker,    setShowPicker]    = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        Promise.all([getGroups(), getUsers()])
            .then(([groupList, userList]) => { setGroups(groupList); setUsers(userList); })
            .catch(() => {});
    }, [isOpen]);

    const groupOptions = useMemo(() => [
        { value: "", label: "Sélectionner un groupe" },
        ...groups.map((g) => ({ value: g.name, label: g.name })),
    ], [groups]);

    const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

    function validate() {
        const e = {};
        if (recipientType === "user"  && !selectedUser)  e.recipient = "Veuillez choisir un destinataire.";
        if (recipientType === "group" && !selectedGroup) e.recipient = "Veuillez choisir un groupe.";
        if (!form.subject.trim())  e.subject = "L'objet est requis.";
        if (!form.message.trim())  e.message = "Le message est requis.";
        return e;
    }

    async function handleSubmit(ev) {
        ev.preventDefault();
        const e = validate();
        if (Object.keys(e).length) { setErrors(e); return; }
        setSubmitting(true);
        try {
            if (recipientType === "user") {
                await sendMessage(selectedUser.id, form.subject, form.message);
            } else {
                const members = users.filter((u) => u.class === selectedGroup);
                await Promise.all(members.map((u) => sendMessage(u.id, form.subject, form.message)));
            }
            handleClose();
        } catch (err) {
            setErrors({ global: err.response?.data?.error ?? "Une erreur est survenue." });
        } finally {
            setSubmitting(false);
        }
    }

    function handleClose() {
        setForm(empty);
        setErrors({});
        setSelectedUser(null);
        setSelectedGroup("");
        setRecipientType("user");
        onClose();
    }

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={handleClose}
                title="Envoyer un message"
                size="md"
                footer={
                    <div className={styles.footer}>
                        <button className={styles.cancelBtn} onClick={handleClose} type="button">Annuler</button>
                        <button className={styles.sendBtn} form="sendMessageForm" type="submit" disabled={submitting}>
                            {submitting ? "Envoi…" : "Envoyer"}
                        </button>
                    </div>
                }
            >
                <form id="sendMessageForm" onSubmit={handleSubmit} className={styles.form}>
                    {errors.global && <p className={styles.error}>{errors.global}</p>}

                    <div className={styles.fieldGroup}>
                        <p className={styles.fieldLabel}>Destinataire</p>
                        <div className={styles.radioGroup}>
                            <label className={styles.radio}>
                                <input type="radio" name="recipientType" value="user"
                                    checked={recipientType === "user"}
                                    onChange={() => { setRecipientType("user"); setSelectedGroup(""); }} />
                                Utilisateur
                            </label>
                            <label className={styles.radio}>
                                <input type="radio" name="recipientType" value="group"
                                    checked={recipientType === "group"}
                                    onChange={() => { setRecipientType("group"); setSelectedUser(null); }} />
                                Groupe
                            </label>
                        </div>

                        {recipientType === "user" && (
                            <div className={styles.userPick}>
                                {selectedUser ? (
                                    <div className={styles.selectedChip}>
                                        <span>{selectedUser.name}</span>
                                        <button type="button" className={styles.changeBtn} onClick={() => setShowPicker(true)}>
                                            Modifier
                                        </button>
                                    </div>
                                ) : (
                                    <button type="button" className={styles.pickBtn} onClick={() => setShowPicker(true)}>
                                        Rechercher un utilisateur…
                                    </button>
                                )}
                                {errors.recipient && <p className={styles.fieldError}>{errors.recipient}</p>}
                            </div>
                        )}

                        {recipientType === "group" && (
                            <FormField
                                type="select"
                                value={selectedGroup}
                                onChange={(e) => setSelectedGroup(e.target.value)}
                                options={groupOptions}
                                error={errors.recipient}
                            />
                        )}
                    </div>

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
                        placeholder="Écrivez votre message…"
                        value={form.message}
                        onChange={set("message")}
                        error={errors.message}
                        rows={5}
                        required
                    />
                </form>
            </Modal>

            <UserPickerModal
                isOpen={showPicker}
                onClose={() => setShowPicker(false)}
                onSelect={(u) => setSelectedUser(u)}
                title="Choisir un destinataire"
            />
        </>
    );
}
