import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Modal from "@/components/ui/Modal/Modal";
import Avatar from "@/components/ui/Avatar/Avatar";
import InfoGrid from "@/components/ui/InfoGrid/InfoGrid";

const ROLE_DISPLAY = {
    student:  "Étudiant",
    teacher:  "Enseignant",
    manager:  "Manager",
    admin:    "Administrateur",
};

export default function ProfileModal() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const displayName = user
        ? `${user.firstname ?? ""} ${user.lastname ?? ""}`.trim() || user.email
        : "";

    return (
        <Modal isOpen onClose={() => navigate(-1)} title="Mon profil" size="sm">
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px", width: "100%" }}>
                <Avatar name={displayName} size="xl" />
                <InfoGrid columns={1}>
                    <InfoGrid.Item label="Nom complet">{displayName}</InfoGrid.Item>
                    <InfoGrid.Item label="Rôle">{ROLE_DISPLAY[user?.role] ?? user?.role}</InfoGrid.Item>
                    {user?.promotion && (
                        <InfoGrid.Item label="Groupe">{user.promotion}</InfoGrid.Item>
                    )}
                    <InfoGrid.Item label="E-mail">{user?.email}</InfoGrid.Item>
                </InfoGrid>
            </div>
        </Modal>
    );
}
