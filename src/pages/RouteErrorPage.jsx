import { useRouteError, isRouteErrorResponse, useNavigate } from "react-router-dom";
import styles from "./ErrorPage.module.scss";

import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import BugReportIcon from "@mui/icons-material/BugReportOutlined";

export default function RouteErrorPage() {
    const error = useRouteError();
    const navigate = useNavigate();

    const is404 = isRouteErrorResponse(error) && error.status === 404;
    const code = isRouteErrorResponse(error) ? error.status : 500;
    const message = is404
        ? "Cette page n'existe pas."
        : isRouteErrorResponse(error)
        ? error.statusText
        : "Une erreur inattendue s'est produite.";

    return (
        <div className={styles.page}>
            <div className={styles.icon}>
                {is404 ? <SentimentDissatisfiedIcon /> : <BugReportIcon />}
            </div>
            <p className={styles.code}>{code}</p>
            <p className={styles.message}>{message}</p>
            <button className={styles.btn} onClick={() => navigate("/")}>
                Retour à l'accueil
            </button>
        </div>
    );
}
