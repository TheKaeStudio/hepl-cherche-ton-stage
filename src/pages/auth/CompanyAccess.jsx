import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getAccessByKey } from "@/api/companies";
import { useAuth } from "@/contexts/AuthContext";
import styles from "./CompanyAccess.module.scss";

function decodeJWT(token) {
    try {
        const payload = token.split(".")[1];
        return JSON.parse(atob(payload));
    } catch {
        return null;
    }
}

export default function CompanyAcces() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login } = useAuth();
    const [error, setError] = useState(null);

    useEffect(() => {
        const key = searchParams.get("key");
        if (!key) { setError("Clé d'accès manquante."); return; }

        getAccessByKey(key)
            .then(({ token }) => {
                const payload = decodeJWT(token);
                if (!payload || payload.role !== "limited" || !payload.companyId) {
                    throw new Error("Token invalide.");
                }
                login(token, { role: "limited", companyId: payload.companyId });
                navigate(`/entreprises/${payload.companyId}/modifier`, { replace: true });
            })
            .catch((err) => {
                setError(err.response?.data?.error ?? err.message ?? "Lien invalide ou expiré.");
            });
    }, []);

    if (error) {
        return (
            <div className={`${styles.screen} ${styles.errorScreen}`}>
                <p className={styles.errorText}>{error}</p>
                <a href="/login" className={styles.backLink}>Retour à la connexion</a>
            </div>
        );
    }

    return (
        <div className={styles.screen}>
            <p>Vérification de votre accès…</p>
        </div>
    );
}
