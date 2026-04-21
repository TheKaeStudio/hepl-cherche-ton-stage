import styles from "./CustomRadio.module.scss";

export default function CustomRadio({ name, value, checked, onChange, children }) {
    return (
        <label className={`${styles.wrap} ${checked ? styles.checked : ""}`}>
            <input
                type="radio"
                name={name}
                value={value}
                checked={checked}
                onChange={onChange}
                className={styles.input}
            />
            <span className={styles.dot} />
            <span className={styles.label}>{children}</span>
        </label>
    );
}
