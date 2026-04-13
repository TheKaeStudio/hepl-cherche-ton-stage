import styles from "./Tag.module.scss";

import CancelIcon from "@mui/icons-material/Cancel";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import SyncIcon from "@mui/icons-material/Sync";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const STATUS_CONFIG = {
    "non-rempli": {
        Icon: CancelIcon,
        color: "#ef4444",
        background: "#fef2f2",
        label: "Non rempli",
    },
    "en-attente": {
        Icon: PauseCircleIcon,
        color: "#6b7280",
        background: "#f9fafb",
        label: "En attente",
    },
    "en-cours": {
        Icon: SyncIcon,
        color: "#f97316",
        background: "#fff7ed",
        label: "En cours",
    },
    termine: {
        Icon: CheckCircleIcon,
        color: "#22c55e",
        background: "#f0fdf4",
        label: "Terminé",
    },
};

export default function Tag({ icon: Icon, background, color, children, status }) {
    if (status) {
        const config = STATUS_CONFIG[status];
        Icon = config.Icon;
        background = config.background;
        color = config.color;
        children = config.label;
    }

    return (
        <li
            style={{
                ...(background && { background }),
                ...(color && { color, borderColor: color }),
            }}
        >
            {Icon && <Icon />}
            <p style={color ? { color } : undefined}>{children}</p>
        </li>
    );
}
