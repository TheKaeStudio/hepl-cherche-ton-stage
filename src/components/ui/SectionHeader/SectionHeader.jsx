import styles from "./SectionHeader.module.scss";

export default function SectionHeader({ title, subtitle, children }) {
    return (
        <div className={styles.header}>
            <div>
                <h2>{title}</h2>
                {subtitle && <p>{subtitle}</p>}
            </div>
            {children && <div className={styles.actions}>{children}</div>}
        </div>
    );
}
