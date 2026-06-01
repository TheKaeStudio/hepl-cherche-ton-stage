import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSideMenu } from "./SideMenuContext";
import styles from "./SideMenu.module.scss";

import NavLink from "@/components/layout/NavLink/NavLink";

import HEPLLogo from "@/assets/logo.png";
import SearchIcon from "@mui/icons-material/Search";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import DomainIcon from "@mui/icons-material/Domain";
import GroupIcon from "@mui/icons-material/Group";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/EditOutlined";

export default function SideMenu() {
    const { isCollapsed, isMobileOpen, toggleCollapse, closeMobile } = useSideMenu();
    const { user } = useAuth();
    const role = user?.role;

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
    const isStaff    = isManager || isAdmin;
    const isLimited  = role === "limited";

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
                    <button
                        className={styles.collapseBtn}
                        onClick={toggleCollapse}
                    >
                        {isCollapsed ? (
                            <ChevronRightIcon />
                        ) : (
                            <ChevronLeftIcon />
                        )}
                    </button>
                    <button className={styles.closeBtn} onClick={closeMobile}>
                        <CloseIcon />
                    </button>
                </div>

                <nav>
                    <div>
                        {/* Limited Access for Company Session */}
                        {isLimited && (
                            <NavLink
                                href={`/entreprises/${user?.companyId}/modifier`}
                                icon={EditIcon}
                            >
                                Modifier mon entreprise
                            </NavLink>
                        )}

                        {(isLimited || isStudent || isTeacher || isStaff) && (
                            <div>
                                <span className={styles.sectionLabel}>
                                    Stages
                                </span>
                                <NavLink href="/" icon={SearchIcon}>
                                    Rechercher un stage
                                </NavLink>
                                <NavLink href="/saved" icon={BookmarkIcon}>
                                    Enregistrés
                                </NavLink>
                            </div>
                        )}

                        {!isLimited && isAdmin && (
                            <div>
                                <span className={styles.sectionLabel}>
                                    Administration
                                </span>
                                <NavLink href="/entreprises" icon={DomainIcon}>
                                    Entreprises
                                </NavLink>
                                {isAdmin && (
                                    <NavLink
                                        href="/utilisateurs"
                                        icon={GroupIcon}
                                    >
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
