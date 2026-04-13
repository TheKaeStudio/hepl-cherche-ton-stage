import { NavLink as RouterNavLink } from "react-router-dom";
import { useSideMenu } from "@/components/layout/SideMenu/SideMenuContext";
import styles from "./NavLink.module.scss";

export default function NavLink({ href, icon: Icon, children, state, badge }) {
    const { isCollapsed, isMobileOpen, closeMobile } = useSideMenu();

    function handleClick() {
        if (isMobileOpen) closeMobile();
    }

    return (
        <RouterNavLink
            to={href}
            state={state}
            onClick={handleClick}
            className={({ isActive }) =>
                [styles.link, isActive ? styles.active : "", isCollapsed ? styles.collapsed : ""]
                    .filter(Boolean)
                    .join(" ")
            }
        >
            <Icon />
            <p>{children}</p>
            {badge > 0 && <span className={styles.badge}>{badge > 99 ? "99+" : badge}</span>}
        </RouterNavLink>
    );
}
