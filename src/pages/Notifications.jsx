import { getNotifications, markNotificationRead, markAllNotificationsRead } from "@/api/notifications";
import { usePaginatedList } from "@/hooks/usePaginatedList";
import { formatDate } from "@/data/mock";
import LoadMore from "@/components/ui/LoadMore/LoadMore";
import ActionButton from "@/components/ui/ActionButton/ActionButton";
import styles from "./Notifications.module.scss";

import DomainAddIcon from "@mui/icons-material/DomainAddOutlined";
import MessageIcon   from "@mui/icons-material/EmailOutlined";
import AssignIcon    from "@mui/icons-material/AssignmentOutlined";
import CommentIcon   from "@mui/icons-material/CommentOutlined";
import StatusIcon    from "@mui/icons-material/AutorenewOutlined";
import CheckIcon     from "@mui/icons-material/DoneAllOutlined";

const NOTIF_CONFIG = {
    new_company:               { Icon: DomainAddIcon, color: "#22c55e", background: "#f0fdf4" },
    new_message:               { Icon: MessageIcon,   color: "#3b82f6", background: "#eff6ff" },
    internship_assigned:       { Icon: AssignIcon,    color: "#f59e0b", background: "#fffbeb" },
    internship_comment:        { Icon: CommentIcon,   color: "#8b5cf6", background: "#f5f3ff" },
    internship_status_changed: { Icon: StatusIcon,    color: "#ec4899", background: "#fdf2f8" },
};

export default function Notifications() {
    const { items: notifications, loading, loadingMore, hasMore, total, loadMore, setItems: setNotifications } =
        usePaginatedList((params) => getNotifications(params), 20);

    const unread = notifications.filter((n) => !n.read).length;

    async function handleMarkAll() {
        await markAllNotificationsRead().catch(() => {});
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }

    async function handleMarkOne(n) {
        if (n.read) return;
        await markNotificationRead(n.id).catch(() => {});
        setNotifications((prev) => prev.map((x) => x.id === n.id ? { ...x, read: true } : x));
    }

    return (
        <section>
            <div className="sectionHeader">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                        <h2>Notifications</h2>
                        <p>{unread > 0 ? `${unread} notification(s) non lue(s).` : "Tout est à jour."}</p>
                    </div>
                    {unread > 0 && (
                        <ActionButton icon={CheckIcon} onClick={handleMarkAll}>
                            Tout marquer comme lu
                        </ActionButton>
                    )}
                </div>
            </div>
            {!loading && notifications.length === 0 && (
                <p style={{ padding: "24px 0", color: "var(--text)", fontSize: "14px" }}>Aucune notification.</p>
            )}
            <ul className={styles.list}>
                {loading && <li style={{ padding: "24px", color: "var(--text)", fontSize: "14px" }}>Chargement…</li>}
                {notifications.map((n) => {
                    const { Icon, color, background } = NOTIF_CONFIG[n.type] ?? {};
                    return (
                        <li
                            key={n.id}
                            className={`${styles.item} ${!n.read ? styles.unread : ""}`}
                            onClick={() => handleMarkOne(n)}
                            style={{ cursor: n.read ? "default" : "pointer" }}
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
            <LoadMore hasMore={hasMore} loading={loadingMore} onLoadMore={loadMore} count={notifications.length} total={total} />
        </section>
    );
}
