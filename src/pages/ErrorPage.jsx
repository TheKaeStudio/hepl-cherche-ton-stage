import { useNavigate } from "react-router-dom";
import styles from "./ErrorPage.module.scss";

import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";

export default function ErrorPage({ code = 404, message = "Cette page n'existe pas." }) {
    const navigate = useNavigate();

    return (
        <div className={styles.page}>
            <div className={styles.icon}>
                <SentimentDissatisfiedIcon />
            </div>
            <p className={styles.code}>{code}</p>
            <p className={styles.message}>{message}</p>
            <button className={styles.btn} onClick={() => navigate("/")}>
                Retour à l'accueil
            </button>
        </div>
    );
}
