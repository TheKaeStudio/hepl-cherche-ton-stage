import styles from "./ActionButton.module.scss";

import { NavLink as RouterNavLink } from "react-router-dom";

export default function ActionButton({
    href,
    icon: Icon,
    children,
    state,
    filled,
    reversed,
}) {
    return (
        <RouterNavLink
            to={href}
            state={state}
            className={({ isActive }) =>
                `${styles.actionButton} ${reversed && styles.reversed} ${children && styles.containsText} ${isActive && styles.active} ${filled && styles.filled}`
            }
        >
            {Icon && <Icon />}
            {children && <p>{children}</p>}
        </RouterNavLink>
    );
}
