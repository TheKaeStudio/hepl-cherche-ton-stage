import styles from "./Tag.module.scss";

import CancelIcon    from "@mui/icons-material/Cancel";
import PauseCircle   from "@mui/icons-material/PauseCircle";
import SyncIcon      from "@mui/icons-material/Sync";
import CheckCircle   from "@mui/icons-material/CheckCircle";
import AssignmentInd from "@mui/icons-material/AssignmentInd";
import UploadIcon    from "@mui/icons-material/Upload";
import FolderIcon    from "@mui/icons-material/FolderOutlined";
import ReplayIcon    from "@mui/icons-material/Replay";

const STATUS_CONFIG = {
    // API statuses
    assigned:       { Icon: AssignmentInd, color: "#6b7280", background: "#f9fafb", label: "À remplir"  },
    submitted:      { Icon: PauseCircle,   color: "#3b82f6", background: "#eff6ff", label: "En attente" },
    rejected:       { Icon: CancelIcon,    color: "#ef4444", background: "#fef2f2", label: "Refusé"     },
    validated:      { Icon: SyncIcon,      color: "#f97316", background: "#fff7ed", label: "À réaliser" },
    docs_submitted: { Icon: FolderIcon,    color: "#8b5cf6", background: "#f5f3ff", label: "Réalisé"    },
    docs_rejected:  { Icon: ReplayIcon,    color: "#f97316", background: "#fff7ed", label: "À revoir"   },
    completed:      { Icon: CheckCircle,   color: "#22c55e", background: "#f0fdf4", label: "Terminé"    },
    // legacy
    in_progress:    { Icon: SyncIcon,      color: "#f97316", background: "#fff7ed", label: "En cours"   },
};

export default function Tag({ icon: Icon, background, color, children, status }) {
    if (status) {
        const cfg = STATUS_CONFIG[status] ?? { Icon: null, color: "#6b7280", background: "#f9fafb", label: status };
        Icon       = cfg.Icon;
        background = cfg.background;
        color      = cfg.color;
        children   = cfg.label;
    }

    return (
        <li style={{ ...(background && { background }), ...(color && { color, borderColor: color }) }}>
            {Icon && <Icon />}
            <p style={color ? { color } : undefined}>{children}</p>
        </li>
    );
}
