import styles from "./IconLabel.module.scss";

export default function IconLabel({ children, icon: Icon }) {
    return (
        <div className={styles.iconLabel}>
            <Icon />
            <label>{children}</label>
        </div>
    );
}
