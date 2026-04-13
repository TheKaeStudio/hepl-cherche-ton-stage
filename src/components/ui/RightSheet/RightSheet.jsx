import CloseIcon from "@mui/icons-material/Close";
import styles from "./RightSheet.module.scss";

export default function RightSheet({ isOpen, onClose, title, children }) {
    return (
        <>
            <div
                className={`${styles.backdrop} ${isOpen ? styles.visible : ""}`}
                onClick={onClose}
            />
            <div className={`${styles.sheet} ${isOpen ? styles.open : ""}`}>
                <div className={styles.header}>
                    <h3>{title}</h3>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <CloseIcon />
                    </button>
                </div>
                <div className={styles.content}>{children}</div>
            </div>
        </>
    );
}
