import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { activateAccount } from "@/api/auth";
import styles from "./Activate.module.scss";

import CheckCircleIcon from "@mui/icons-material/CheckCircleOutlined";
import ErrorIcon from "@mui/icons-material/ErrorOutlined";

export default function Activate() {
    const { token } = useParams();
    const [status, setStatus] = useState("loading"); // loading | success | error
    const [message, setMessage] = useState("");

    useEffect(() => {
        activateAccount(token)
            .then(() => setStatus("success"))
            .catch((err) => {
                setMessage(err.response?.data?.message ?? "Lien invalide ou expiré.");
                setStatus("error");
            });
    }, [token]);

    if (status === "loading") {
        return (
            <div className={styles.page}>
                <p className={styles.loading}>Activation en cours…</p>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <div className={`${styles.card} ${status === "success" ? styles.success : styles.error}`}>
                {status === "success"
                    ? <CheckCircleIcon className={styles.icon} />
                    : <ErrorIcon className={styles.icon} />
                }
                <h1 className={styles.title}>
                    {status === "success" ? "Compte activé !" : "Activation échouée"}
                </h1>
                <p className={styles.subtitle}>
                    {status === "success"
                        ? "Votre compte est maintenant actif. Vous pouvez vous connecter."
                        : message}
                </p>
                <Link to="/login" className={styles.btn}>
                    {status === "success" ? "Se connecter" : "Retour à la connexion"}
                </Link>
            </div>
        </div>
    );
}
