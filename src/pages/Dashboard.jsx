import { stages, users, companies, messages, notifications, currentUser, ROLE_LABEL } from "@/data/mock";
import Tag from "@/components/ui/Tag/Tag";
import styles from "./Dashboard.module.scss";

import AssignmentIcon from "@mui/icons-material/AssignmentOutlined";
import SchoolIcon from "@mui/icons-material/SchoolOutlined";
import DomainIcon from "@mui/icons-material/DomainOutlined";
import InboxIcon from "@mui/icons-material/InboxOutlined";

const unreadMessages = messages.filter((m) => !m.read).length;
const unreadNotifs = notifications.filter((n) => !n.read).length;
const myStages = stages.filter((s) => s.student.id === currentUser.id);

const STATS = [
    { label: "Stages", value: stages.length, Icon: AssignmentIcon, color: "#f97316", bg: "#fff7ed" },
    { label: "Étudiants", value: users.filter((u) => u.role === "etudiant").length, Icon: SchoolIcon, color: "#3b82f6", bg: "#eff6ff" },
    { label: "Entreprises", value: companies.length, Icon: DomainIcon, color: "#22c55e", bg: "#f0fdf4" },
    { label: "Messages non lus", value: unreadMessages, Icon: InboxIcon, color: "#aa3bff", bg: "#f5f0ff" },
];

export default function Dashboard() {
    return (
        <section>
            <div className="sectionHeader">
                <h2>Tableau de bord</h2>
                <p>Bonjour, {currentUser.name} — {ROLE_LABEL[currentUser.role]}</p>
            </div>

            <div className={styles.stats}>
                {STATS.map(({ label, value, Icon, color, bg }) => (
                    <div key={label} className={styles.statCard}>
                        <div className={styles.statIcon} style={{ background: bg, color }}>
                            <Icon />
                        </div>
                        <div>
                            <p className={styles.statValue}>{value}</p>
                            <p className={styles.statLabel}>{label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {myStages.length > 0 && (
                <div className={styles.section}>
                    <p className={styles.sectionTitle}>Mes stages</p>
                    <div className={styles.stageList}>
                        {myStages.map((stage) => (
                            <div key={stage.id} className={styles.stageRow}>
                                <div className={styles.stageInfo}>
                                    <p className={styles.stageName}>{stage.title}</p>
                                    <p className={styles.stageCompany}>{stage.company.name}</p>
                                </div>
                                <ul><Tag status={stage.status} /></ul>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {unreadNotifs > 0 && (
                <div className={styles.section}>
                    <p className={styles.sectionTitle}>Notifications récentes</p>
                    <div className={styles.notifList}>
                        {notifications
                            .filter((n) => !n.read)
                            .map((n) => (
                                <p key={n.id} className={styles.notifItem}>{n.message}</p>
                            ))}
                    </div>
                </div>
            )}
        </section>
    );
}
