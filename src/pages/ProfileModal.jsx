import { useNavigate } from "react-router-dom";
import { currentUser, ROLE_LABEL } from "@/data/mock";
import Modal from "@/components/ui/Modal/Modal";
import Avatar from "@/components/ui/Avatar/Avatar";
import InfoGrid from "@/components/ui/InfoGrid/InfoGrid";

export default function ProfileModal() {
    const navigate = useNavigate();

    return (
        <Modal isOpen onClose={() => navigate(-1)} title="Mon profil" size="sm">
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px", width: "100%" }}>
                <Avatar name={currentUser.name} size="xl" />
                <InfoGrid columns={1}>
                    <InfoGrid.Item label="Nom complet">{currentUser.name}</InfoGrid.Item>
                    <InfoGrid.Item label="Rôle">{ROLE_LABEL[currentUser.role]}</InfoGrid.Item>
                    {currentUser.class && (
                        <InfoGrid.Item label="Groupe">{currentUser.class}</InfoGrid.Item>
                    )}
                    <InfoGrid.Item label="E-mail">{currentUser.email}</InfoGrid.Item>
                </InfoGrid>
            </div>
        </Modal>
    );
}
