import { useState, useEffect, useMemo } from "react";
import { getUsers } from "@/api/users";
import Modal from "@/components/ui/Modal/Modal";
import styles from "./UserPickerModal.module.scss";

const ROLE_LABEL = {
    etudiant:   "Étudiant",
    enseignant: "Enseignant",
    manager:    "Manager",
    admin:      "Administrateur",
};

export default function UserPickerModal({ isOpen, onClose, onSelect, title = "Choisir un utilisateur" }) {
    const [search, setSearch] = useState("");
    const [users,  setUsers]  = useState([]);

    useEffect(() => {
        if (!isOpen) { setSearch(""); return; }
        getUsers().then(setUsers).catch(() => {});
    }, [isOpen]);

    const filtered = useMemo(() => {
        const q = search.toLowerCase().trim();
        const list = q
            ? users.filter((u) =>
                u.name.toLowerCase().includes(q) ||
                u.email.toLowerCase().includes(q)
              )
            : users;
        return list.slice(0, 20);
    }, [users, search]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
            <div className={styles.wrap}>
                <input
                    className={styles.searchInput}
                    placeholder="Rechercher par nom ou e-mail…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    autoComplete="off"
                />
                {filtered.length === 0 ? (
                    <p className={styles.empty}>Aucun résultat</p>
                ) : (
                    <ul className={styles.list}>
                        {filtered.map((u) => (
                            <li
                                key={u.id}
                                className={styles.item}
                                onClick={() => { onSelect(u); onClose(); }}
                            >
                                <span className={styles.name}>{u.name}</span>
                                <span className={styles.role}>{ROLE_LABEL[u.role] ?? u.role}</span>
                                {u.role === "etudiant" && u.class && (
                                    <span className={styles.group}>{u.class}</span>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </Modal>
    );
}
