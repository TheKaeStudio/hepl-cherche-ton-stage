import CheckIcon from "@mui/icons-material/Check";
import styles from "./CustomCheckbox.module.scss";

export default function CustomCheckbox({ checked, onChange, children }) {
    return (
        <label className={`${styles.wrap} ${checked ? styles.checked : ""}`}>
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className={styles.input}
            />
            <span className={styles.box}>
                {checked && <CheckIcon className={styles.checkIcon} />}
            </span>
            <span className={styles.label}>{children}</span>
        </label>
    );
}
