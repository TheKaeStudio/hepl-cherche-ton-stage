import { messages } from "@/data/mock";
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

export default function SideMenu() {
    const unreadCount = messages.filter((m) => !m.read).length;
    const { isCollapsed, isMobileOpen, toggleCollapse, closeMobile } = useSideMenu();

    const menuClass = [
        styles.sideMenu,
        isCollapsed ? styles.collapsed : "",
        isMobileOpen ? styles.mobileOpen : "",
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <>
            {isMobileOpen && (
                <div className={styles.overlay} onClick={closeMobile} />
            )}
            <aside className={menuClass}>
                <div className={styles.sideMenuHeader}>
                    <img
                        src={HEPLLogo}
                        className={styles.HEPLLogo}
                        alt="Logo de la HEPL"
                    />
                    {/* Collapse button – desktop only */}
                    <button className={styles.collapseBtn} onClick={toggleCollapse}>
                        {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </button>
                    {/* Close button – mobile only */}
                    <button className={styles.closeBtn} onClick={closeMobile}>
                        <CloseIcon />
                    </button>
                </div>
                <nav>
                    <div>
                        <NavLink href="/" icon={DashboardIcon}>
                            Tableau de bord
                        </NavLink>

                        <div>
                            <span className={styles.sectionLabel}>Mon stage</span>
                            <NavLink href="/mon-stage" icon={MenuBookIcon}>
                                Mes stages
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

                        <div>
                            <span className={styles.sectionLabel}>Étudiants</span>
                            <NavLink href="/stages" icon={AssignmentIcon}>
                                Liste des stages
                            </NavLink>
                            <NavLink href="/etudiants" icon={SchoolIcon}>
                                Étudiants
                            </NavLink>
                        </div>

                        <div>
                            <span className={styles.sectionLabel}>Administration</span>
                            <NavLink href="/entreprises" icon={DomainIcon}>
                                Liste des entreprises
                            </NavLink>
                            <NavLink href="/utilisateurs" icon={GroupIcon}>
                                Utilisateurs
                            </NavLink>
                        </div>
                    </div>
                </nav>
            </aside>
        </>
    );
}
