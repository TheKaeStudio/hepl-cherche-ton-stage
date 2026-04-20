import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSideMenu } from "@/components/layout/SideMenu/SideMenuContext";
import { useAuth } from "@/contexts/AuthContext";
import { getNotifications } from "@/api/notifications";
import styles from "./StatusBar.module.scss";

import ActionButton from "@/components/ui/ActionButton/ActionButton";
import Avatar from "@/components/ui/Avatar/Avatar";

import NotificationsIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsIcon from "@mui/icons-material/SettingsOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircleOutlined";
import LogoutIcon from "@mui/icons-material/LogoutOutlined";

const ROLE_DISPLAY = {
    student:  "Étudiant",
    teacher:  "Enseignant",
    manager:  "Manager",
    admin:    "Administrateur",
};

export default function StatusBar() {
    const navigate = useNavigate();
    const location = useLocation();
    const background = { background: location };
    const { openMobile } = useSideMenu();
    const { user, logout } = useAuth();
    const [showMenu, setShowMenu] = useState(false);
    const [unreadNotifs, setUnreadNotifs] = useState(0);
    const menuRef = useRef(null);

    const displayName = user
        ? `${user.firstname ?? ""} ${user.lastname ?? ""}`.trim() || user.email
        : "";
    const displayRole = ROLE_DISPLAY[user?.role] ?? user?.role ?? "";

    useEffect(() => {
        getNotifications()
            .then((notifs) => setUnreadNotifs(notifs.filter((n) => !n.read).length))
            .catch(() => {});
    }, []);

    useEffect(() => {
        function onClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        }
        document.addEventListener("mousedown", onClickOutside);
        return () => document.removeEventListener("mousedown", onClickOutside);
    }, []);

    function handleLogout() {
        setShowMenu(false);
        logout();
        navigate("/login");
    }

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
                        <Avatar name={displayName} src={user?.photo} size="md" />
                        <div className={styles.userText}>
                            <h4>{displayName}</h4>
                            <p>{displayRole}</p>
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
                                onClick={handleLogout}
                            >
                                <LogoutIcon />
                                Se déconnecter
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className={styles.statusButtons}>
                <div className={styles.notifWrap}>
                    <ActionButton
                        icon={NotificationsIcon}
                        onClick={() => navigate("/notifications", { state: background })}
                    />
                    {unreadNotifs > 0 && <span className={styles.notifBadge} />}
                </div>
                <ActionButton
                    icon={SettingsIcon}
                    onClick={() => navigate("/parametres", { state: background })}
                />
            </div>
        </header>
    );
}
