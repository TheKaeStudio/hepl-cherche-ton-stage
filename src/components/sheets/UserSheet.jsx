import RightSheet from "@/components/ui/RightSheet/RightSheet";
import Avatar from "@/components/ui/Avatar/Avatar";
import InfoGrid from "@/components/ui/InfoGrid/InfoGrid";
import styles from "./UserSheet.module.scss";

const ROLE_DISPLAY = {
    student:    "Étudiant",
    teacher:    "Enseignant",
    etudiant:   "Étudiant",
    enseignant: "Enseignant",
    manager:    "Manager",
    admin:      "Administrateur",
};

export default function UserSheet({ user, onClose }) {
    const displayName = user
        ? `${user.firstname ?? user.name ?? ""}`.trim()
        : "";

    return (
        <RightSheet isOpen={!!user} onClose={onClose} title="Profil">
            {user && (
                <>
                    <div className={styles.header}>
                        <Avatar name={user.name} src={user.photo} size="lg" />
                        <div className={styles.headerText}>
                            <h2 className={styles.name}>{user.name}</h2>
                            <p className={styles.role}>{ROLE_DISPLAY[user.role] ?? user.role}</p>
                        </div>
                    </div>

                    <InfoGrid columns={1}>
                        <InfoGrid.Item label="E-mail">{user.email ?? "—"}</InfoGrid.Item>
                        {user.phone && (
                            <InfoGrid.Item label="Téléphone">{user.phone}</InfoGrid.Item>
                        )}
                        {user.class && (
                            <InfoGrid.Item label="Groupe">{user.class}</InfoGrid.Item>
                        )}
                    </InfoGrid>
                </>
            )}
        </RightSheet>
    );
}
