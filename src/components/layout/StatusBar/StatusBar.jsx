import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSideMenu } from "@/components/layout/SideMenu/SideMenuContext";
import styles from "./StatusBar.module.scss";

import ActionButton from "@/components/ui/ActionButton/ActionButton";

import ProfilePicture from "@assets/pp.png";

import NotificationsIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsIcon from "@mui/icons-material/SettingsOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircleOutlined";
import LogoutIcon from "@mui/icons-material/LogoutOutlined";

export default function StatusBar() {
    const navigate = useNavigate();
    const location = useLocation();
    const background = { background: location };
    const { openMobile } = useSideMenu();
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);

    // Close dropdown on outside click
    useEffect(() => {
        function onClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        }
        document.addEventListener("mousedown", onClickOutside);
        return () => document.removeEventListener("mousedown", onClickOutside);
    }, []);

    return (
        <header>
            <div className={styles.left}>
                <div className={styles.burgerWrap}>
                    <ActionButton icon={MenuIcon} onClick={openMobile} />
                </div>

                <div className={styles.userMenuWrap} ref={menuRef}>
                    <button
                        className={styles.userInfo}
                        onClick={() => setShowMenu((v) => !v)}
                    >
                        <img src={ProfilePicture} alt="Profile Picture" />
                        <div className={styles.userText}>
                            <h4>Koçak Ali</h4>
                            <p>Étudiant</p>
                        </div>
                    </button>

                    {showMenu && (
                        <div className={styles.userMenu}>
                            <button
                                className={styles.userMenuItem}
                                onClick={() => {
                                    setShowMenu(false);
                                    navigate("/profil", { state: background });
                                }}
                            >
                                <AccountCircleIcon />
                                Mon profil
                            </button>
                            <div className={styles.userMenuDivider} />
                            <button
                                className={`${styles.userMenuItem} ${styles.danger}`}
                                onClick={() => {
                                    setShowMenu(false);
                                    navigate("/login");
                                }}
                            >
                                <LogoutIcon />
                                Se déconnecter
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className={styles.statusButtons}>
                <ActionButton
                    icon={NotificationsIcon}
                    onClick={() => navigate("/notifications", { state: background })}
                />
                <ActionButton
                    icon={SettingsIcon}
                    onClick={() => navigate("/parametres", { state: background })}
                />
            </div>
        </header>
    );
}
