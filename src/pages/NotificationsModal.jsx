import { useNavigate } from "react-router-dom";
import { notifications, formatDate } from "@/data/mock";
import Modal from "@/components/ui/Modal/Modal";
import styles from "./Notifications.module.scss";
import DomainAddIcon from "@mui/icons-material/DomainAddOutlined";
import MessageIcon from "@mui/icons-material/EmailOutlined";

const NOTIF_CONFIG = {
    new_company: { Icon: DomainAddIcon, color: "#22c55e", background: "#f0fdf4" },
    new_message:  { Icon: MessageIcon,   color: "#3b82f6", background: "#eff6ff" },
};

const NOTIF_ROUTES = {
    new_company: "/recherche",
    new_message: "/inbox",
};

export default function NotificationsModal() {
    const navigate = useNavigate();
    const unread = notifications.filter((n) => !n.read).length;

    function handleClick(notif) {
        const route = NOTIF_ROUTES[notif.type];
        if (route) navigate(route);
    }

    return (
        <Modal
            isOpen
            onClose={() => navigate(-1)}
            title="Notifications"
            size="sm"
        >
            <p style={{ marginBottom: "12px" }}>
                {unread > 0 ? `${unread} notification(s) non lue(s).` : "Tout est à jour."}
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
