import { useSecteurs } from "@/contexts/SecteurContext";
import ManageTagsModal from "@/components/ui/ManageTagsModal/ManageTagsModal";

export default function GestionSecteursModal({ isOpen, onClose }) {
    const { sectors, addSector, updateSector, deleteSector } = useSecteurs();

    return (
        <ManageTagsModal
            isOpen={isOpen}
            onClose={onClose}
            title="Gérer les secteurs"
            items={sectors}
            onAdd={(name, color) => addSector(name, color)}
            onUpdate={(id, name, color) => updateSector(id, name, color)}
            onDelete={(id) => deleteSector(id)}
            placeholder="Nouveau secteur…"
        />
    );
}
