import styles from "./CompanyCard.module.scss";

import Tag from "@components/ui/Tag/Tag";
import IconLabel from "@components/ui/IconLabel/IconLabel";
import ActionButton from "@components/ui/ActionButton/ActionButton";

import ITIcon from "@mui/icons-material/Devices";
import ViewIcon from "@mui/icons-material/Visibility";
import ShareIcon from "@mui/icons-material/Share";
import MailIcon from "@mui/icons-material/Mail"
import PhoneIcon from "@mui/icons-material/Phone"
import ArrowRightIcon from "@mui/icons-material/ArrowForward"
import EVSLogo from "@assets/evs.png";

export default function CompanyCard({ children }) {
    return (
        <article className={styles.companyCard}>
            <ul>
                <Tag icon={ITIcon} color="#FC5958" background="#FFEEEE">
                    Informatique
                </Tag>
                <Tag icon={ITIcon}>Informatique</Tag>
                <Tag icon={ITIcon}>Informatique</Tag>
            </ul>
            <div className={styles.companyInfos}>
                <img src={EVSLogo} alt={children} />
                <div>
                    <h3>{children}</h3>
                    <p>
                        EVS Broadcast Equipment est une entreprise belge
                        spécialisée dans la fabrication de serveurs vidéo
                        destinés à l'enregistrement d'images professionnelles
                        sur supports informatiques et de leur traitement.
                    </p>
                </div>
            </div>
            <div className={styles.companyActions}>
                <div className={styles.iconLabelList}>
                    <IconLabel icon={ViewIcon}>14</IconLabel>
                    <IconLabel icon={ShareIcon}>Partager</IconLabel>
                    <IconLabel icon={MailIcon}>Envoyer un mail</IconLabel>
                    <IconLabel icon={PhoneIcon}>Appeler</IconLabel>
                </div>
                <ActionButton icon={ArrowRightIcon} reversed filled>
                    En savoir plus
                </ActionButton>
            </div>
        </article>
    );
}
