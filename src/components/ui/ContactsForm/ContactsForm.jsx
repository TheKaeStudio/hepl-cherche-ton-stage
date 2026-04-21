import FormField from "@/components/ui/FormField/FormField";
import AddIcon    from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/RemoveCircleOutlined";
import styles from "./ContactsForm.module.scss";

export const emptyContact = () => ({ name: "", email: "", phone: "" });

export default function ContactsForm({ contacts, onChange, label = "Contacts" }) {
    function update(i, key, value) {
        onChange(contacts.map((c, idx) => idx === i ? { ...c, [key]: value } : c));
    }

    return (
        <div className={styles.root}>
            <div className={styles.header}>
                <p className={styles.label}>{label}</p>
                <button type="button" className={styles.addBtn} onClick={() => onChange([...contacts, emptyContact()])}>
                    <AddIcon fontSize="small" /> Ajouter un contact
                </button>
            </div>
            {contacts.map((contact, i) => (
                <div key={i} className={styles.block}>
                    {contacts.length > 1 && (
                        <button
                            type="button"
                            className={styles.removeBtn}
                            onClick={() => onChange(contacts.filter((_, idx) => idx !== i))}
                        >
                            <RemoveIcon fontSize="small" />
                        </button>
                    )}
                    <div className={styles.row}>
                        <FormField label="Nom" placeholder="Prénom Nom" value={contact.name} onChange={(e) => update(i, "name", e.target.value)} />
                        <FormField label="E-mail" type="email" placeholder="contact@entreprise.be" value={contact.email} onChange={(e) => update(i, "email", e.target.value)} />
                    </div>
                    <FormField label="Téléphone" type="tel" placeholder="+32 4 66 00 00 00" value={contact.phone} onChange={(e) => update(i, "phone", e.target.value)} />
                </div>
            ))}
        </div>
    );
}
