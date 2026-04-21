import { useState, useEffect } from "react";
import { getGroups, createGroup, updateGroup, deleteGroup } from "@/api/groups";
import Modal from "@/components/ui/Modal/Modal";
import styles from "./GestionSecteursModal.module.scss";

import EditIcon   from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import CheckIcon  from "@mui/icons-material/Check";
import CloseIcon  from "@mui/icons-material/Close";

function hexToBackground(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, 0.12)`;
}

export default function GestionGroupesModal({ isOpen, onClose }) {
    const [groups,    setGroups]    = useState([]);
    const [editId,    setEditId]    = useState(null);
    const [editName,  setEditName]  = useState("");
    const [editColor, setEditColor] = useState("#3b82f6");
    const [saving,    setSaving]    = useState(false);

    const [newName,  setNewName]  = useState("");
    const [newColor, setNewColor] = useState("#3b82f6");
    const [adding,   setAdding]   = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        getGroups().then(setGroups).catch(() => {});
    }, [isOpen]);

    function startEdit(group) {
        setEditId(group._id);
        setEditName(group.name);
        setEditColor(group.color);
    }

    async function saveEdit() {
        if (!editName.trim() || saving) return;
        setSaving(true);
        try {
            const updated = await updateGroup(editId, { name: editName, color: editColor });
            setGroups((prev) => prev.map((g) => g._id === editId ? updated : g));
            setEditId(null);
        } finally {
            setSaving(false);
        }
    }

    async function handleAdd() {
        if (!newName.trim() || adding) return;
        setAdding(true);
        try {
            const group = await createGroup({ name: newName.trim().toUpperCase(), color: newColor });
            setGroups((prev) => [...prev, group]);
            setNewName("");
            setNewColor("#3b82f6");
        } finally {
            setAdding(false);
        }
    }

    async function handleDelete(id) {
        await deleteGroup(id).catch(() => {});
        setGroups((prev) => prev.filter((g) => g._id !== id));
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Gérer les groupes" size="sm">
            <div className={styles.wrap}>
                <ul className={styles.list}>
                    {groups.map((g) => (
                        <li key={g._id} className={styles.row}>
                            {editId === g._id ? (
                                <div className={styles.editRow}>
                                    <input
                                        type="color"
                                        className={styles.colorPicker}
                                        value={editColor}
                                        onChange={(e) => setEditColor(e.target.value)}
                                    />
                                    <input
                                        className={styles.nameInput}
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value.toUpperCase())}
                                        onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                                        autoFocus
                                    />
                                    <button className={styles.iconBtn} onClick={saveEdit} disabled={saving}><CheckIcon fontSize="small" /></button>
                                    <button className={styles.iconBtn} onClick={() => setEditId(null)}><CloseIcon fontSize="small" /></button>
                                </div>
                            ) : (
                                <div className={styles.viewRow}>
                                    <span
                                        className={styles.swatch}
                                        style={{ background: hexToBackground(g.color), border: `2px solid ${g.color}` }}
                                    />
                                    <span className={styles.name} style={{ color: g.color }}>{g.name}</span>
                                    <div className={styles.actions}>
                                        <button className={styles.iconBtn} onClick={() => startEdit(g)}><EditIcon fontSize="small" /></button>
                                        <button className={`${styles.iconBtn} ${styles.danger}`} onClick={() => handleDelete(g._id)}><DeleteIcon fontSize="small" /></button>
                                    </div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>

                <div className={styles.addRow}>
                    <input
                        type="color"
                        className={styles.colorPicker}
                        value={newColor}
                        onChange={(e) => setNewColor(e.target.value)}
                    />
                    <input
                        className={styles.nameInput}
                        placeholder="Nouveau groupe…"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value.toUpperCase())}
                        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                    />
                    <button
                        className={styles.addBtn}
                        onClick={handleAdd}
                        disabled={!newName.trim() || adding}
                    >
                        {adding ? "…" : "Ajouter"}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
