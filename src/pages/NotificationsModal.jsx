import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getNotifications, markNotificationRead, markAllNotificationsRead } from "@/api/notifications";
import { formatDate } from "@/data/mock";
import Modal from "@/components/ui/Modal/Modal";
import ActionButton from "@/components/ui/ActionButton/ActionButton";
import styles from "./Notifications.module.scss";

import DomainAddIcon from "@mui/icons-material/DomainAddOutlined";
import MessageIcon from "@mui/icons-material/EmailOutlined";
import AssignmentIcon from "@mui/icons-material/AssignmentOutlined";
import CommentIcon from "@mui/icons-material/ChatBubbleOutlined";
import SyncIcon from "@mui/icons-material/SyncOutlined";
import DoneAllIcon from "@mui/icons-material/DoneAll";

const NOTIF_CONFIG = {
    new_message:               { Icon: MessageIcon,    color: "#3b82f6", background: "#eff6ff" },
    new_company:               { Icon: DomainAddIcon,  color: "#22c55e", background: "#f0fdf4" },
    internship_assigned:       { Icon: AssignmentIcon, color: "#f97316", background: "#fff7ed" },
    internship_comment:        { Icon: CommentIcon,    color: "#a855f7", background: "#faf5ff" },
    internship_status_changed: { Icon: SyncIcon,       color: "#6b7280", background: "#f9fafb" },
};

const NOTIF_ROUTES = {
    new_message: "/inbox",
    new_company: "/recherche",
    internship_assigned:       "/mon-stage",
    internship_comment:        "/mon-stage",
    internship_status_changed: "/mon-stage",
};

export default function NotificationsModal() {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getNotifications()
            .then(setNotifications)
            .finally(() => setLoading(false));
    }, []);

    async function handleClick(notif) {
        if (!notif.read) {
            await markNotificationRead(notif.id).catch(() => {});
            setNotifications((prev) =>
                prev.map((n) => n.id === notif.id ? { ...n, read: true } : n)
            );
        }
        const route = NOTIF_ROUTES[notif.type];
        if (route) navigate(route);
    }

    async function handleReadAll() {
        await markAllNotificationsRead().catch(() => {});
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }

    const unread = notifications.filter((n) => !n.read).length;

    return (
        <Modal
            isOpen
            onClose={() => navigate(-1)}
            title="Notifications"
            size="sm"
            footer={
                unread > 0 ? (
                    <ActionButton icon={DoneAllIcon} onClick={handleReadAll}>
                        Tout marquer comme lu
                    </ActionButton>
                ) : null
            }
        >
            <p style={{ marginBottom: "12px", fontSize: "14px", color: "var(--text)" }}>
                {loading ? "Chargement…" : unread > 0 ? `${unread} non lue(s).` : "Tout est à jour."}
            </p>
            <ul className={styles.list}>
                {notifications.map((n) => {
                    const { Icon, color, background } = NOTIF_CONFIG[n.type] ?? {};
                    return (
                        <li
                            key={n.id}
                            className={`${styles.item} ${!n.read ? styles.unread : ""}`}
                            onClick={() => handleClick(n)}
                        >
                            <div className={styles.iconWrap} style={{ background, color }}>
                                {Icon && <Icon />}
                            </div>
                            <div className={styles.content}>
                                <p className={styles.message}>{n.message}</p>
                                <span className={styles.date}>{formatDate(n.date)}</span>
                            </div>
                            {!n.read && <div className={styles.dot} />}
                        </li>
                    );
                })}
            </ul>
        </Modal>
    );
}
