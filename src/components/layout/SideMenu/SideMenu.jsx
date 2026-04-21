import { useState, useEffect } from "react";
import { getMessages } from "@/api/messages";
import { useAuth } from "@/contexts/AuthContext";
import { useSideMenu } from "./SideMenuContext";
import styles from "./SideMenu.module.scss";

import NavLink from "@/components/layout/NavLink/NavLink";

import HEPLLogo from "@/assets/logo.png";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SearchIcon from "@mui/icons-material/Search";
import InboxIcon from "@mui/icons-material/Inbox";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SchoolIcon from "@mui/icons-material/School";
import DomainIcon from "@mui/icons-material/Domain";
import GroupIcon from "@mui/icons-material/Group";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/EditOutlined";

export default function SideMenu() {
    const [unreadCount, setUnreadCount] = useState(0);
    const { isCollapsed, isMobileOpen, toggleCollapse, closeMobile } = useSideMenu();
    const { user } = useAuth();
    const role = user?.role; // 'student' | 'teacher' | 'manager' | 'admin'

    useEffect(() => {
        getMessages()
            .then((msgs) => setUnreadCount(msgs.filter((m) => !m.read).length))
            .catch(() => {});
    }, []);

    const menuClass = [
        styles.sideMenu,
        isCollapsed ? styles.collapsed : "",
        isMobileOpen ? styles.mobileOpen : "",
    ]
        .filter(Boolean)
        .join(" ");

    const isStudent  = role === "student";
    const isTeacher  = role === "teacher";
    const isManager  = role === "manager";
    const isAdmin    = role === "admin";
    const isStaff    = isTeacher || isManager || isAdmin;
    const isLimited  = role === "limited";

    return (
        <>
            {isMobileOpen && (
                <div className={styles.overlay} onClick={closeMobile} />
            )}
            <aside className={menuClass}>
                <div className={styles.sideMenuHeader}>
                    <img src={HEPLLogo} className={styles.HEPLLogo} alt="Logo de la HEPL" />
                    <button className={styles.collapseBtn} onClick={toggleCollapse}>
                        {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </button>
                    <button className={styles.closeBtn} onClick={closeMobile}>
                        <CloseIcon />
                    </button>
                </div>

                <nav>
                    <div>
                        {/* Accès limité entreprise */}
                        {isLimited && (
                            <NavLink href={`/entreprises/${user?.companyId}/modifier`} icon={EditIcon}>
                                Modifier mon entreprise
                            </NavLink>
                        )}

                        {/* Commun à tous sauf limited */}
                        {!isLimited && (
                        <NavLink href="/" icon={DashboardIcon}>
                            Tableau de bord
                        </NavLink>
                        )}

                        {/* Section étudiant */}
                        {!isLimited && isStudent && (
                            <div>
                                <span className={styles.sectionLabel}>Mon stage</span>
                                <NavLink href="/mon-stage" icon={MenuBookIcon}>
                                    Mon stage
                                </NavLink>
                                <NavLink href="/recherche" icon={SearchIcon}>
                                    Rechercher un stage
                                </NavLink>
                                <NavLink href="/inbox" icon={InboxIcon} badge={unreadCount}>
                                    Boîte de réception
                                </NavLink>
                                <NavLink href="/saved" icon={BookmarkIcon}>
                                    Enregistrés
                                </NavLink>
                            </div>
                        )}

                        {/* Section staff (prof / manager / admin) */}
                        {!isLimited && isStaff && (
                            <div>
                                <span className={styles.sectionLabel}>Navigation</span>
                                <NavLink href="/recherche" icon={SearchIcon}>
                                    Rechercher un stage
                                </NavLink>
                                <NavLink href="/inbox" icon={InboxIcon} badge={unreadCount}>
                                    Boîte de réception
                                </NavLink>
                                <NavLink href="/saved" icon={BookmarkIcon}>
                                    Enregistrés
                                </NavLink>
                            </div>
                        )}

                        {/* Section gestion (prof / manager / admin) */}
                        {!isLimited && isStaff && (
                            <div>
                                <span className={styles.sectionLabel}>Gestion</span>
                                <NavLink href="/stages" icon={AssignmentIcon}>
                                    Liste des stages
                                </NavLink>
                                <NavLink href="/etudiants" icon={SchoolIcon}>
                                    Étudiants
                                </NavLink>
                            </div>
                        )}

                        {/* Section administration (manager / admin) */}
                        {!isLimited && (isManager || isAdmin) && (
                            <div>
                                <span className={styles.sectionLabel}>Administration</span>
                                <NavLink href="/entreprises" icon={DomainIcon}>
                                    Entreprises
                                </NavLink>
                                {isAdmin && (
                                    <NavLink href="/utilisateurs" icon={GroupIcon}>
                                        Utilisateurs
                                    </NavLink>
                                )}
                            </div>
                        )}
                    </div>
                </nav>
            </aside>
        </>
    );
}
