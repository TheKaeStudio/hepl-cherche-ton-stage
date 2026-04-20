import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import styles from "./AuthLayout.module.scss";
import HEPLLogo from "@/assets/logo.png";

export default function AuthLayout() {
    const { isAuthenticated } = useAuth();
    if (isAuthenticated) return <Navigate to="/" replace />;
    return (
        <div className={styles.layout}>
            <div className={styles.form}>
                <div className={styles.formInner}>
                    <Outlet />
                </div>
            </div>
            <div className={styles.brand}></div>
        </div>
    );
}
