import { NavLink as RouterNavLink } from "react-router-dom"
import styles from "./NavLink.module.scss"

export default function NavLink({ href, icon: Icon, children, state }) {
    return (
        <RouterNavLink
            to={href}
            state={state}
            className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ""}`
            }
        >
            <Icon />
            <p>{children}</p>
        </RouterNavLink>
    );
}
