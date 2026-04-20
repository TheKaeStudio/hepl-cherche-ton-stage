import { Link } from "react-router-dom";
import styles from "./Activate.module.scss";
import MarkEmailUnreadIcon from "@mui/icons-material/MarkEmailUnread";

export default function VerifyEmail() {
    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <MarkEmailUnreadIcon className={styles.icon} style={{ color: "#f97316" }} />
                <h1 className={styles.title}>Compte non vérifié</h1>
                <p className={styles.subtitle}>
                    Votre compte n'a pas encore été activé. Vérifiez votre boîte e-mail
                    et cliquez sur le lien d'activation que vous avez reçu lors de votre inscription.
                </p>
                <Link to="/login" className={styles.btn}>
                    Retour à la connexion
                </Link>
            </div>
        </div>
    );
}
