import { stageMessages, currentUser } from "@/data/mock";
import RightSheet from "@/components/ui/RightSheet/RightSheet";
import InfoGrid from "@/components/ui/InfoGrid/InfoGrid";
import Tag from "@/components/ui/Tag/Tag";
import MessageThread from "@/components/ui/MessageThread/MessageThread";
import styles from "./StageSheet.module.scss";
import EmailIcon from "@mui/icons-material/EmailOutlined";
import PhoneIcon from "@mui/icons-material/PhoneOutlined";

export default function StageSheet({ stage, onClose }) {
    const messages = stageMessages.filter((m) => m.stageId === stage?.id);

    return (
        <RightSheet isOpen={!!stage} onClose={onClose} title="Détails du stage">
            {stage && (
                <>
                    <div className={styles.titleSection}>
                        <ul><Tag status={stage.status} /></ul>
                        <h2 className={styles.title}>{stage.title}</h2>
                    </div>

                    <InfoGrid columns={2}>
                        <InfoGrid.Item label="Étudiant">{stage.student.name}</InfoGrid.Item>
                        <InfoGrid.Item label="Groupe">{stage.group}</InfoGrid.Item>
                        <InfoGrid.Item label="Entreprise">{stage.company.name}</InfoGrid.Item>
                        <InfoGrid.Item label="Responsable">{stage.supervisor}</InfoGrid.Item>
                        <InfoGrid.Item label="Début">
                            {new Date(stage.startDate).toLocaleDateString("fr-BE", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            })}
                        </InfoGrid.Item>
                        <InfoGrid.Item label="Fin">
                            {new Date(stage.endDate).toLocaleDateString("fr-BE", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            })}
                        </InfoGrid.Item>
                    </InfoGrid>

                    <div className={styles.contactSection}>
                        <p className={styles.sectionLabel}>Contact entreprise</p>
                        <a
                            href={`mailto:${stage.company.contact.email}`}
                            className={styles.contactLink}
                        >
                            <EmailIcon />
                            {stage.company.contact.email}
                        </a>
                        <a
                            href={`tel:${stage.company.contact.phone}`}
                            className={styles.contactLink}
                        >
                            <PhoneIcon />
                            {stage.company.contact.phone}
                        </a>
                    </div>

                    {messages.length > 0 && (
                        <div className={styles.messagesSection}>
                            <p className={styles.sectionLabel}>Messages</p>
                            <MessageThread
                                messages={messages}
                                currentUserId={currentUser.id}
                            />
                        </div>
                    )}
                </>
            )}
        </RightSheet>
    );
}
