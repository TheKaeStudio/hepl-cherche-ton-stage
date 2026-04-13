import { Outlet } from "react-router-dom";
import styles from "./AuthLayout.module.scss";
import HEPLLogo from "@/assets/logo.png";

export default function AuthLayout() {
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
