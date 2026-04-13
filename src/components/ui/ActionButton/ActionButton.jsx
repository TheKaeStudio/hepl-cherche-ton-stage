import { NavLink as RouterNavLink } from "react-router-dom";
import styles from "./ActionButton.module.scss";

export default function ActionButton({
    href,
    icon: Icon,
    children,
    state,
    filled,
    reversed,
    onClick,
    type = "button",
    disabled,
}) {
    const className = [
        styles.actionButton,
        reversed && styles.reversed,
        children && styles.containsText,
        filled && styles.filled,
        disabled && styles.disabled,
    ]
        .filter(Boolean)
        .join(" ");

    // Rendu avec navigation
    if (href) {
        return (
            <RouterNavLink to={href} state={state} className={className}>
                {Icon && <Icon />}
                {children && <p>{children}</p>}
            </RouterNavLink>
        );
    }

    // Rendu comme bouton (onClick, formulaire, modale…)
    return (
        <button
            type={type}
            className={className}
            onClick={onClick}
            disabled={disabled}
        >
            {Icon && <Icon />}
            {children && <p>{children}</p>}
        </button>
    );
}
