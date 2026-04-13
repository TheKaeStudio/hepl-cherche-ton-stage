import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import styles from "./Avatar.module.scss";

export default function Avatar({ src, name, size = "md" }) {
    if (src) {
        return (
            <img
                src={src}
                alt={name}
                className={`${styles.avatar} ${styles[size]}`}
            />
        );
    }

    return (
        <div className={`${styles.avatar} ${styles.placeholder} ${styles[size]}`}>
            <AccountCircleIcon />
        </div>
    );
}
