import Tag from "@/components/ui/Tag/Tag";
import InfoGrid from "@/components/ui/InfoGrid/InfoGrid";
import ActionButton from "@/components/ui/ActionButton/ActionButton";
import EmailIcon from "@mui/icons-material/EmailOutlined";
import PhoneIcon from "@mui/icons-material/PhoneOutlined";
import ArrowRightIcon from "@mui/icons-material/ArrowForward";
import styles from "./StageCard.module.scss";

export default function StageCard({ stage, onLearnMore }) {
    return (
        <article className={styles.card}>
            <div className={styles.top}>
                <Tag status={stage.status} />
                <h3>{stage.title}</h3>
            </div>

            <InfoGrid columns={5}>
                <InfoGrid.Item label="Nom">{stage.student.name}</InfoGrid.Item>
                <InfoGrid.Item label="Entreprise">{stage.company.name}</InfoGrid.Item>
                <InfoGrid.Item label="Responsable du stage">{stage.supervisor}</InfoGrid.Item>
                <InfoGrid.Item label="Durée du stage">
                    {new Date(stage.startDate).toLocaleDateString("fr-BE", { day: "numeric", month: "long" })}
                    {" au "}
                    {new Date(stage.endDate).toLocaleDateString("fr-BE", { day: "numeric", month: "long", year: "numeric" })}
                </InfoGrid.Item>
                <InfoGrid.Item label="Groupe">{stage.group}</InfoGrid.Item>
            </InfoGrid>

            <div className={styles.footer}>
                <div className={styles.contacts}>
                    {stage.company?.contact?.email && (
                        <a href={`mailto:${stage.company.contact.email}`} className={styles.contactBtn}>
                            <EmailIcon />
                            <span>Envoyer un mail</span>
                        </a>
                    )}
                    {stage.company?.contact?.phone && (
                        <a href={`tel:${stage.company.contact.phone}`} className={styles.contactBtn}>
                            <PhoneIcon />
                            <span>Appeler</span>
                        </a>
                    )}
                </div>
                <div className={styles.learnMore}>
                    <ActionButton icon={ArrowRightIcon} reversed onClick={onLearnMore}>
                        En savoir plus
                    </ActionButton>
                </div>
            </div>
        </article>
    );
}
