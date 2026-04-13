import styles from "./StatusBar.module.scss";

import ActionButton from "@/components/ui/ActionButton/ActionButton";

import ProfilePicture from "@assets/pp.png";

import NotificationsIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsIcon from "@mui/icons-material/SettingsOutlined";

export default function StatusBar() {
    return (
        <header>
            <div className={styles.userInfo}>
                <img src={ProfilePicture} alt="Profile Picture" />
                <div>
                    <h4>Koçak Ali</h4>
                    <p>Étudiant</p>
                </div>
            </div>
            <div className={styles.statusButtons}>
                <ActionButton icon={NotificationsIcon} />
                <ActionButton icon={SettingsIcon} />
            </div>
        </header>
    );
}
