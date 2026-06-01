import { useState } from "react";
import { useCompanyFields } from "@/contexts/CompanyFieldsContext";
import Modal from "@/components/ui/Modal/Modal";
import styles from "./ManageCompanyFieldsModal.module.scss";

import AddIcon    from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon   from "@mui/icons-material/EditOutlined";
import CheckIcon  from "@mui/icons-material/Check";
import CloseIcon  from "@mui/icons-material/Close";

export default function ManageCompanyFieldsModal({ isOpen, onClose }) {
    const { fields, addField, editField, removeField } = useCompanyFields();
    const [newLabel,   setNewLabel]   = useState("");
    const [editingId,  setEditingId]  = useState(null);
    const [editLabel,  setEditLabel]  = useState("");
    const [busy,       setBusy]       = useState(false);

    async function handleAdd() {
        if (!newLabel.trim() || busy) return;
        setBusy(true);
        try {
            await addField(newLabel.trim());
            setNewLabel("");
        } finally {
            setBusy(false);
        }
    }

    function startEdit(field) {
        setEditingId(field._id);
        setEditLabel(field.label);
    }

    async function handleEdit() {
        if (!editLabel.trim() || busy) return;
        setBusy(true);
        try {
            await editField(editingId, editLabel.trim());
            setEditingId(null);
        } finally {
            setBusy(false);
        }
    }

    async function handleDelete(id) {
        if (busy) return;
        setBusy(true);
        try {
            await removeField(id);
        } finally {
            setBusy(false);
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Modifier le formulaire" size="sm">
            <div className={styles.content}>
                <p className={styles.hint}>
                    Ces cases à cocher apparaissent dans tous les formulaires entreprise.
                </p>

                <div className={styles.list}>
                    {fields.length === 0 && (
                        <p className={styles.empty}>Aucun champ. Ajoutez-en un ci-dessous.</p>
                    )}
                    {fields.map((field) => (
                        <div key={field._id} className={styles.item}>
                            {editingId === field._id ? (
                                <div className={styles.editRow}>
                                    <input
                                        className={styles.editInput}
                                        value={editLabel}
                                        onChange={(e) => setEditLabel(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleEdit()}
                                        autoFocus
                                    />
                                    <button className={styles.iconBtn} onClick={handleEdit} disabled={busy} title="Valider">
                                        <CheckIcon fontSize="small" />
                                    </button>
                                    <button className={styles.iconBtn} onClick={() => setEditingId(null)} title="Annuler">
                                        <CloseIcon fontSize="small" />
                                    </button>
                                </div>
                            ) : (
                                <div className={styles.readRow}>
                                    <span className={styles.fieldLabel}>{field.label}</span>
                                    <button className={styles.iconBtn} onClick={() => startEdit(field)} title="Modifier">
                                        <EditIcon fontSize="small" />
                                    </button>
                                    <button className={`${styles.iconBtn} ${styles.danger}`} onClick={() => handleDelete(field._id)} disabled={busy} title="Supprimer">
                                        <DeleteIcon fontSize="small" />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className={styles.addRow}>
                    <input
                        className={styles.addInput}
                        placeholder="Nouveau champ…"
                        value={newLabel}
                        onChange={(e) => setNewLabel(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                    />
                    <button
                        className={styles.addBtn}
                        onClick={handleAdd}
                        disabled={busy || !newLabel.trim()}
                    >
                        <AddIcon fontSize="small" />
                        Ajouter
                    </button>
                </div>
            </div>
        </Modal>
    );
}
