import styles from "./CompanyCard.module.scss";

import Tag from "@components/ui/Tag/Tag";
import IconLabel from "@components/ui/IconLabel/IconLabel";
import ActionButton from "@components/ui/ActionButton/ActionButton";

import DevicesIcon from "@mui/icons-material/Devices";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import StoreIcon from "@mui/icons-material/Storefront";
import FactoryIcon from "@mui/icons-material/Factory";
import DomainIcon from "@mui/icons-material/Domain";
import ViewIcon from "@mui/icons-material/Visibility";
import ShareIcon from "@mui/icons-material/Share";
import MailIcon from "@mui/icons-material/Mail";
import PhoneIcon from "@mui/icons-material/Phone";
import ArrowRightIcon from "@mui/icons-material/ArrowForward";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";

import { DOMAIN_CONFIG } from "@/data/mock";

const DOMAIN_ICONS = {
    Informatique: DevicesIcon,
    Agriculture: AgricultureIcon,
    Commerce: StoreIcon,
    Industrie: FactoryIcon,
};

export default function CompanyCard({ company, onLearnMore, isSaved, onToggleSave }) {
    const domainCfg = DOMAIN_CONFIG[company?.domain];
    const DomainIconComp = DOMAIN_ICONS[company?.domain] ?? DomainIcon;

    return (
        <article className={styles.companyCard}>
            <ul>
                {company?.domain && (
                    <Tag
                        icon={DomainIconComp}
                        color={domainCfg?.color}
                        background={domainCfg?.background}
                    >
                        {company.domain}
                    </Tag>
                )}
                {company?.offresObservation && (
                    <Tag>Stage d'observation</Tag>
                )}
                {company?.offres3e && (
                    <Tag>Stage BAC3</Tag>
                )}
            </ul>
            <div className={styles.companyInfos}>
                {company?.logo ? (
                    <img src={company.logo} alt={company.name} />
                ) : (
                    <div className={styles.logoPlaceholder}>
                        <AccountCircleIcon />
                    </div>
                )}
                <div>
                    <h3>{company?.name}</h3>
                    <p>{company?.description}</p>
                </div>
            </div>
            <div className={styles.companyActions}>
                <div className={styles.iconLabelList}>
                    <IconLabel icon={ViewIcon}>14</IconLabel>
                    <IconLabel icon={ShareIcon}>Partager</IconLabel>
                    {company?.contact?.email && (
                        <IconLabel icon={MailIcon}>Envoyer un mail</IconLabel>
                    )}
                    {company?.contact?.phone && (
                        <IconLabel icon={PhoneIcon}>Appeler</IconLabel>
                    )}
                </div>
                <div className={styles.cardButtons}>
                    {onToggleSave && (
                        <button
                            className={`${styles.saveBtn} ${isSaved ? styles.saveBtnActive : ""}`}
                            onClick={onToggleSave}
                            title={isSaved ? "Retirer des enregistrés" : "Enregistrer"}
                        >
                            {isSaved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                        </button>
                    )}
                    <ActionButton icon={ArrowRightIcon} reversed filled onClick={onLearnMore}>
                        En savoir plus
                    </ActionButton>
                </div>
            </div>
        </article>
    );
}
