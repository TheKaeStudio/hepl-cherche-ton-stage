import styles from "./Tag.module.scss";

import CancelIcon    from "@mui/icons-material/Cancel";
import PauseCircle   from "@mui/icons-material/PauseCircle";
import SyncIcon      from "@mui/icons-material/Sync";
import CheckCircle   from "@mui/icons-material/CheckCircle";
import AssignmentInd from "@mui/icons-material/AssignmentInd";
import FolderIcon    from "@mui/icons-material/FolderOutlined";
import ReplayIcon    from "@mui/icons-material/Replay";
import GroupIcon     from "@mui/icons-material/Group";

const STATUS_CONFIG = {
    assigned:       { Icon: AssignmentInd, color: "#6b7280", background: "#f9fafb", label: "À remplir"  },
    submitted:      { Icon: PauseCircle,   color: "#3b82f6", background: "#eff6ff", label: "En attente" },
    rejected:       { Icon: CancelIcon,    color: "#ef4444", background: "#fef2f2", label: "Refusé"     },
    validated:      { Icon: SyncIcon,      color: "#f97316", background: "#fff7ed", label: "À réaliser" },
    docs_submitted: { Icon: FolderIcon,    color: "#8b5cf6", background: "#f5f3ff", label: "Réalisé"    },
    docs_rejected:  { Icon: ReplayIcon,    color: "#f97316", background: "#fff7ed", label: "À revoir"   },
    completed:      { Icon: CheckCircle,   color: "#22c55e", background: "#f0fdf4", label: "Terminé"    },
    in_progress:    { Icon: SyncIcon,      color: "#f97316", background: "#fff7ed", label: "En cours"   },
};

function hexToAlpha(hex, a = 0.12) {
    if (!hex || hex.length < 7) return `rgba(107,114,128,${a})`;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${a})`;
}

export { hexToAlpha };

export default function Tag({ icon: Icon, background, color, children, status, group, sector }) {
    if (status) {
        const cfg = STATUS_CONFIG[status] ?? { Icon: null, color: "#6b7280", background: "#f9fafb", label: status };
        Icon       = cfg.Icon;
        background = cfg.background;
        color      = cfg.color;
        children   = cfg.label;
    } else if (group) {
        const c    = group.color ?? "#6b7280";
        color      = c;
        background = hexToAlpha(c);
        children   = group.name ?? "—";
        Icon       = GroupIcon;
    } else if (sector !== undefined) {
        const c    = sector?.color ?? "#6b7280";
        color      = c;
        background = hexToAlpha(c);
        children   = sector?.name ?? "Aucun secteur";
        Icon       = null;
    }

    return (
        <li className={styles.tag} style={{ ...(background && { background }), ...(color && { color, borderColor: color }) }}>
            {Icon && <Icon />}
            <p style={color ? { color } : undefined}>{children}</p>
        </li>
    );
}
