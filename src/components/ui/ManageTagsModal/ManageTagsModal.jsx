import { useState } from "react";
import Modal from "@/components/ui/Modal/Modal";
import styles from "./ManageTagsModal.module.scss";

import EditIcon   from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import CheckIcon  from "@mui/icons-material/Check";
import CloseIcon  from "@mui/icons-material/Close";
import AddIcon    from "@mui/icons-material/Add";

function hexToAlpha(hex, alpha = 0.12) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function ManageTagsModal({
    isOpen,
    onClose,
    title,
    items,
    onAdd,
    onUpdate,
    onDelete,
    uppercase = false,
    placeholder = "Nouveau…",
}) {
    const [editId,    setEditId]    = useState(null);
    const [editName,  setEditName]  = useState("");
    const [editColor, setEditColor] = useState("#3b82f6");
    const [saving,    setSaving]    = useState(false);

    const [newName,   setNewName]   = useState("");
    const [newColor,  setNewColor]  = useState("#3b82f6");
    const [adding,    setAdding]    = useState(false);

    const normalize = (v) => uppercase ? v.toUpperCase() : v;

    function startEdit(item) {
        setEditId(item._id);
        setEditName(item.name);
        setEditColor(item.color ?? "#3b82f6");
    }

    function cancelEdit() {
        setEditId(null);
        setEditName("");
        setEditColor("#3b82f6");
    }

    async function saveEdit() {
        if (!editName.trim() || saving) return;
        setSaving(true);
        try {
            await onUpdate(editId, normalize(editName.trim()), editColor);
            cancelEdit();
        } finally {
            setSaving(false);
        }
    }

    async function handleAdd() {
        if (!newName.trim() || adding) return;
        setAdding(true);
        try {
            await onAdd(normalize(newName.trim()), newColor);
            setNewName("");
            setNewColor("#3b82f6");
        } finally {
            setAdding(false);
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
            <div className={styles.root}>

                {items.length === 0 && (
                    <p className={styles.empty}>Aucun élément. Ajoutez-en un ci-dessous.</p>
                )}

                {items.length > 0 && (
                    <ul className={styles.list}>
                        {items.map((item) => (
                            <li key={item._id} className={styles.item} style={{ borderLeftColor: item.color }}>
                                {editId === item._id ? (
                                    <div className={styles.editRow}>
                                        <label className={styles.colorWrap} title="Couleur" style={{ background: hexToAlpha(editColor) }}>
                                            <input
                                                type="color"
                                                className={styles.colorInput}
                                                value={editColor}
                                                onChange={(e) => setEditColor(e.target.value)}
                                            />
                                            <span className={styles.colorDot} style={{ background: editColor }} />
                                        </label>
                                        <input
                                            className={styles.nameInput}
                                            value={editName}
                                            onChange={(e) => setEditName(normalize(e.target.value))}
                                            onKeyDown={(e) => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") cancelEdit(); }}
                                            autoFocus
                                        />
                                        <div className={styles.rowActions}>
                                            <button className={styles.confirmBtn} onClick={saveEdit} disabled={saving} title="Enregistrer">
                                                <CheckIcon fontSize="small" />
                                            </button>
                                            <button className={styles.cancelBtn} onClick={cancelEdit} title="Annuler">
                                                <CloseIcon fontSize="small" />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={styles.viewRow}>
                                        <span
                                            className={styles.tag}
                                            style={{ background: hexToAlpha(item.color), color: item.color }}
                                        >
                                            {item.name}
                                        </span>
                                        <div className={styles.rowActions}>
                                            <button className={styles.iconBtn} onClick={() => startEdit(item)} title="Modifier">
                                                <EditIcon fontSize="small" />
                                            </button>
                                            <button className={`${styles.iconBtn} ${styles.danger}`} onClick={() => onDelete(item._id)} title="Supprimer">
                                                <DeleteIcon fontSize="small" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}

                <div className={styles.addSection}>
                    <p className={styles.addLabel}>Ajouter</p>
                    <div className={styles.addRow}>
                        <label className={styles.colorWrap} title="Couleur" style={{ background: hexToAlpha(newColor) }}>
                            <input
                                type="color"
                                className={styles.colorInput}
                                value={newColor}
                                onChange={(e) => setNewColor(e.target.value)}
                            />
                            <span className={styles.colorDot} style={{ background: newColor }} />
                        </label>
                        <input
                            className={styles.nameInput}
                            placeholder={placeholder}
                            value={newName}
                            onChange={(e) => setNewName(normalize(e.target.value))}
                            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                        />
                        <button
                            className={styles.addBtn}
                            onClick={handleAdd}
                            disabled={!newName.trim() || adding}
                        >
                            <AddIcon fontSize="small" />
                            {adding ? "…" : "Ajouter"}
                        </button>
                    </div>
                </div>

            </div>
        </Modal>
    );
}
