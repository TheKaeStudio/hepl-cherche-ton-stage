import { useState } from "react";
import { useSecteurs } from "@/contexts/SecteurContext";
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

export default function GestionSecteursModal({ isOpen, onClose }) {
    const { sectors, addSector, updateSector, deleteSector } = useSecteurs();

    const [editId,    setEditId]    = useState(null);
    const [editName,  setEditName]  = useState("");
    const [editColor, setEditColor] = useState("#3b82f6");
    const [saving,    setSaving]    = useState(false);

    const [newName,  setNewName]  = useState("");
    const [newColor, setNewColor] = useState("#3b82f6");
    const [adding,   setAdding]   = useState(false);

    function startEdit(sector) {
        setEditId(sector._id);
        setEditName(sector.name);
        setEditColor(sector.color);
    }

    async function saveEdit() {
        if (!editName.trim() || saving) return;
        setSaving(true);
        try {
            await updateSector(editId, editName, editColor);
            setEditId(null);
        } finally {
            setSaving(false);
        }
    }

    async function handleAdd() {
        if (!newName.trim() || adding) return;
        setAdding(true);
        try {
            await addSector(newName, newColor);
            setNewName("");
            setNewColor("#3b82f6");
        } finally {
            setAdding(false);
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Gérer les secteurs" size="sm">
            <div className={styles.wrap}>
                <ul className={styles.list}>
                    {sectors.map((s) => (
                        <li key={s._id} className={styles.row}>
                            {editId === s._id ? (
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
                                        onChange={(e) => setEditName(e.target.value)}
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
                                        style={{ background: hexToBackground(s.color), border: `2px solid ${s.color}` }}
                                    />
                                    <span className={styles.name} style={{ color: s.color }}>{s.name}</span>
                                    <div className={styles.actions}>
                                        <button className={styles.iconBtn} onClick={() => startEdit(s)}><EditIcon fontSize="small" /></button>
                                        <button className={`${styles.iconBtn} ${styles.danger}`} onClick={() => deleteSector(s._id)}><DeleteIcon fontSize="small" /></button>
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
                        placeholder="Nouveau secteur…"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
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
