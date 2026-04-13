import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import Modal from "@/components/ui/Modal/Modal";
import styles from "./SettingsModal.module.scss";
import LightModeIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeIcon from "@mui/icons-material/DarkModeOutlined";

export default function SettingsModal() {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();

    return (
        <Modal isOpen onClose={() => navigate(-1)} title="Paramètres" size="sm">
            <div className={styles.section}>
                <p className={styles.sectionTitle}>Apparence</p>
                <div className={styles.themeToggle}>
                    <button
                        className={`${styles.themeOption} ${theme === "light" ? styles.active : ""}`}
                        onClick={() => theme !== "light" && toggleTheme()}
                    >
                        <LightModeIcon />
                        <span>Clair</span>
                    </button>
                    <button
                        className={`${styles.themeOption} ${theme === "dark" ? styles.active : ""}`}
                        onClick={() => theme !== "dark" && toggleTheme()}
                    >
                        <DarkModeIcon />
                        <span>Sombre</span>
                    </button>
                </div>
            </div>
        </Modal>
    );
}
