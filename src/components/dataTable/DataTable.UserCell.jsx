import { useState, useRef } from "react";
import Tag from "../ui/Tag/Tag";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EmailIcon from "@mui/icons-material/EmailOutlined";
import styles from "./DataTable.UserCell.module.scss";

const ROLE_LABEL = {
    etudiant: "Étudiant",
    enseignant: "Enseignant",
    admin: "Administrateur",
};

function ProfileCard({ user, position }) {
    return (
        <div className={styles.card} style={{ top: position.top, left: position.left }}>
            <div className={styles.cardHeader}>
                {user.photo ? (
                    <img src={user.photo} className={styles.avatar} alt={user.name} />
                ) : (
                    <AccountCircleIcon className={styles.avatarIcon} />
                )}
                <div>
                    <p className={styles.name}>{user.name}</p>
                    <p className={styles.role}>
                        {ROLE_LABEL[user.role]}
                        {user.role === "etudiant" && user.class && ` • ${user.class}`}
                    </p>
                </div>
            </div>

            <div className={styles.email}>
                <EmailIcon fontSize="small" />
                <span>{user.email}</span>
            </div>

            {user.role === "etudiant" && user.stageStatus && (
                <div className={styles.stageRow}>
                    <span>Stage</span>
                    <Tag status={user.stageStatus} />
                </div>
            )}
        </div>
    );
}

export default function UserCell({ children, user }) {
    const [showCard, setShowCard] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const ref = useRef();

    const handleMouseEnter = () => {
        if (!user) return;
        const rect = ref.current.getBoundingClientRect();
        setPosition({ top: rect.bottom + 8, left: rect.left });
        setShowCard(true);
    };

    return (
        <td
            ref={ref}
            className={styles.cell}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => setShowCard(false)}
        >
            {children}
            {showCard && user && <ProfileCard user={user} position={position} />}
        </td>
    );
}
