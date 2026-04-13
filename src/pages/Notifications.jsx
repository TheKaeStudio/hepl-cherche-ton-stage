import { notifications, formatDate } from "@/data/mock";
import styles from "./Notifications.module.scss";
import DomainAddIcon from "@mui/icons-material/DomainAddOutlined";
import MessageIcon from "@mui/icons-material/EmailOutlined";

const NOTIF_CONFIG = {
    new_company: { Icon: DomainAddIcon, color: "#22c55e", background: "#f0fdf4" },
    new_message:  { Icon: MessageIcon,   color: "#3b82f6", background: "#eff6ff" },
};

export default function Notifications() {
    const unread = notifications.filter((n) => !n.read).length;

    return (
        <section>
            <div className="sectionHeader">
                <h2>Notifications</h2>
                <p>{unread > 0 ? `${unread} notification(s) non lue(s).` : "Tout est à jour."}</p>
            </div>
            <ul className={styles.list}>
                {notifications.map((n) => {
                    const { Icon, color, background } = NOTIF_CONFIG[n.type] ?? {};
                    return (
                        <li key={n.id} className={`${styles.item} ${!n.read ? styles.unread : ""}`}>
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
        </section>
    );
}
