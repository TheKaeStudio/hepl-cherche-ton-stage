import styles from "./EmptyState.module.scss";

export default function EmptyState({ icon: Icon, title, description, action }) {
    return (
        <div className={styles.wrapper}>
            {Icon && (
                <div className={styles.iconWrapper}>
                    <Icon />
                </div>
            )}
            <p className={styles.title}>{title}</p>
            {description && <p className={styles.description}>{description}</p>}
            {action && <div className={styles.action}>{action}</div>}
        </div>
    );
}
