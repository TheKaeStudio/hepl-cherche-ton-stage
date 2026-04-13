import { Outlet } from "react-router-dom";
import styles from "./AuthLayout.module.scss";
import HEPLLogo from "@/assets/logo.png";

export default function AuthLayout() {
    return (
        <div className={styles.layout}>
            <div className={styles.brand}>
                <img src={HEPLLogo} alt="HEPL" className={styles.logo} />
                <div className={styles.brandContent}>
                    <h1 className={styles.title}>HEPL Cherche Ton Stage</h1>
                    <p className={styles.subtitle}>
                        La plateforme de gestion des stages de la Haute École
                        de la Province de Liège.
                    </p>
                </div>
            </div>
            <div className={styles.form}>
                <div className={styles.formInner}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
