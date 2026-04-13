import Modal from "@/components/ui/Modal/Modal";
import styles from "./DeleteConfirm.module.scss";
import WarningIcon from "@mui/icons-material/WarningAmberOutlined";

export default function DeleteConfirm({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirmer la suppression",
    message = "Cette action est irréversible. Souhaitez-vous continuer ?",
}) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="sm"
            footer={
                <div className={styles.footer}>
                    <button className={styles.cancelBtn} onClick={onClose}>
                        Annuler
                    </button>
                    <button className={styles.deleteBtn} onClick={onConfirm}>
                        Supprimer
                    </button>
                </div>
            }
        >
            <div className={styles.body}>
                <div className={styles.iconWrap}>
                    <WarningIcon />
                </div>
                <p className={styles.message}>{message}</p>
            </div>
        </Modal>
    );
}
