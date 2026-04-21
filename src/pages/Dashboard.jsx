import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getCompanies } from "@/api/companies";
import { getMessages } from "@/api/messages";
import { getInternships } from "@/api/internships";
import { getNotifications } from "@/api/notifications";
import { ROLE_LABEL, formatDate } from "@/data/mock";
import Tag from "@/components/ui/Tag/Tag";
import styles from "./Dashboard.module.scss";

import DomainIcon from "@mui/icons-material/DomainOutlined";
import InboxIcon from "@mui/icons-material/InboxOutlined";
import MessageIcon from "@mui/icons-material/EmailOutlined";
import DomainAddIcon from "@mui/icons-material/DomainAddOutlined";
import AssignmentIcon from "@mui/icons-material/AssignmentOutlined";
import CommentIcon from "@mui/icons-material/ChatBubbleOutlined";
import SyncIcon from "@mui/icons-material/SyncOutlined";

const ACTIVITY_CONFIG = {
    new_message:               { Icon: MessageIcon,   color: "#3b82f6", bg: "#eff6ff" },
    new_company:               { Icon: DomainAddIcon, color: "#22c55e", bg: "#f0fdf4" },
    internship_assigned:       { Icon: AssignmentIcon, color: "#f97316", bg: "#fff7ed" },
    internship_comment:        { Icon: CommentIcon,   color: "#a855f7", bg: "#faf5ff" },
    internship_status_changed: { Icon: SyncIcon,      color: "#6b7280", bg: "#f9fafb" },
};

export default function Dashboard() {
    const { user } = useAuth();
    const [companiesCount, setCompaniesCount] = useState(0);
    const [unreadMessages, setUnreadMessages] = useState(0);
    const [myStages, setMyStages] = useState([]);
    const [notifications, setNotifications] = useState([]);

    const isStudent = user?.role === "student";
    const isStaff   = ["manager", "admin"].includes(user?.role);
    const isTeacher = user?.role === "teacher";

    useEffect(() => {
        getCompanies().then((list) => setCompaniesCount(list.length)).catch(() => {});
        getMessages().then((msgs) => setUnreadMessages(msgs.filter((m) => !m.read).length)).catch(() => {});
        if (!isTeacher) {
            getInternships()
                .then((list) => {
                    if (isStaff) setMyStages(list.filter((s) => s.status !== "completed"));
                    else setMyStages(list);
                })
                .catch(() => {});
        }
        getNotifications().then(setNotifications).catch(() => {});
    }, []);

    const STATS = [
        { label: "Entreprises",     value: companiesCount,  Icon: DomainIcon, color: "#22c55e", bg: "#f0fdf4" },
        { label: "Messages non lus", value: unreadMessages, Icon: InboxIcon,  color: "#3b82f6", bg: "#eff6ff" },
    ];

    const recentActivity = notifications.slice(0, 6);

    return (
        <section>
            <div className="sectionHeader">
                <h2>Tableau de bord</h2>
                <p>
                    Bonjour, {user ? `${user.firstname ?? user.name ?? ""} ${user.lastname ?? ""}`.trim() : "—"}
                    {user?.role ? ` — ${ROLE_LABEL[user.role] ?? user.role}` : ""}
                </p>
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

            {!isTeacher && myStages.length > 0 && (
                <div className={styles.section}>
                    <p className={styles.sectionTitle}>
                        {isStaff ? "Stages en cours" : "Mes stages"}
                    </p>
                    <div className={styles.stageList}>
                        {myStages.map((stage) => (
                            <div key={stage.id} className={styles.stageRow}>
                                <div className={styles.stageInfo}>
                                    <p className={styles.stageName}>
                                        {stage.title ?? stage.typeLabel ?? stage.type ?? "Stage"}
                                    </p>
                                    <p className={styles.stageCompany}>
                                        {isStaff
                                            ? (stage.student?.name ?? "—")
                                            : (stage.company?.name ?? stage.companyName ?? "—")}
                                    </p>
                                </div>
                                <ul><Tag status={stage.status} /></ul>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className={styles.section}>
                <p className={styles.sectionTitle}>Activité récente</p>
                {recentActivity.length === 0 ? (
                    <div className={styles.emptyActivity}>
                        Aucune activité récente.
                    </div>
                ) : (
                    <div className={styles.activityList}>
                        {recentActivity.map((n) => {
                            const cfg = ACTIVITY_CONFIG[n.type] ?? { Icon: SyncIcon, color: "#6b7280", bg: "#f9fafb" };
                            return (
                                <div key={n.id} className={`${styles.activityItem} ${!n.read ? styles.activityUnread : ""}`}>
                                    <div className={styles.activityIcon} style={{ background: cfg.bg, color: cfg.color }}>
                                        <cfg.Icon />
                                    </div>
                                    <div className={styles.activityContent}>
                                        <p className={styles.activityMessage}>{n.message}</p>
                                        <p className={styles.activityDate}>{formatDate(n.date)}</p>
                                    </div>
                                    {!n.read && <div className={styles.activityDot} />}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}
