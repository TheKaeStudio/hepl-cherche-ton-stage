import styles from "./DataTable.Actions.module.scss";

import EditIcon from "@mui/icons-material/EditOutlined";
import VisibilityIcon from "@mui/icons-material/VisibilityOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import BookmarkIcon from "@mui/icons-material/BookmarkBorderOutlined";
import VpnKeyIcon from "@mui/icons-material/VpnKeyOutlined";

export default function Actions({ onEdit, onView, onDelete, onBookmark, onGiveAccess }) {
    return (
        <td className={styles.cell}>
            <div className={styles.actions}>
                {onBookmark && (
                    <button className={`${styles.btn} ${styles.bookmark}`} onClick={onBookmark} title="Enregistrer">
                        <BookmarkIcon />
                    </button>
                )}
                {onGiveAccess && (
                    <button className={`${styles.btn} ${styles.access}`} onClick={onGiveAccess} title="Donner accès">
                        <VpnKeyIcon />
                    </button>
                )}
                {onEdit && (
                    <button className={styles.btn} onClick={onEdit} title="Modifier">
                        <EditIcon />
                    </button>
                )}
                {onView && (
                    <button className={styles.btn} onClick={onView} title="Voir les détails">
                        <VisibilityIcon />
                    </button>
                )}
                {onDelete && (
                    <button
                        className={`${styles.btn} ${styles.delete}`}
                        onClick={onDelete}
                        title="Supprimer"
                    >
                        <DeleteIcon />
                    </button>
                )}
            </div>
        </td>
    );
}
