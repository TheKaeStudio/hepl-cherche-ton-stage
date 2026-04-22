import { useState, useEffect } from "react";
import { getGroups, createGroup, updateGroup, deleteGroup } from "@/api/groups";
import ManageTagsModal from "@/components/ui/ManageTagsModal/ManageTagsModal";

export default function GestionGroupesModal({ isOpen, onClose }) {
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        if (!isOpen) return;
        getGroups().then(setGroups).catch(() => {});
    }, [isOpen]);

    async function handleAdd(name, color) {
        const group = await createGroup({ name, color });
        setGroups((prev) => [...prev, group]);
    }

    async function handleUpdate(id, name, color) {
        const updated = await updateGroup(id, { name, color });
        setGroups((prev) => prev.map((g) => g._id === id ? updated : g));
    }

    async function handleDelete(id) {
        await deleteGroup(id).catch(() => {});
        setGroups((prev) => prev.filter((g) => g._id !== id));
    }

    return (
        <ManageTagsModal
            isOpen={isOpen}
            onClose={onClose}
            title="Gérer les groupes"
            items={groups}
            onAdd={handleAdd}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            uppercase
            placeholder="Nouveau groupe…"
        />
    );
}
