import styles from "./CompanyCard.module.scss";

import Tag from "@components/ui/Tag/Tag";
import ActionButton from "@components/ui/ActionButton/ActionButton";

import DevicesIcon from "@mui/icons-material/Devices";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import StoreIcon from "@mui/icons-material/Storefront";
import FactoryIcon from "@mui/icons-material/Factory";
import DomainIcon from "@mui/icons-material/Domain";
import MailIcon from "@mui/icons-material/MailOutlined";
import PhoneIcon from "@mui/icons-material/PhoneOutlined";
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
                <div className={styles.contactLinks}>
                    {company?.contact?.email && (
                        <a href={`mailto:${company.contact.email}`} className={styles.contactLink}>
                            <MailIcon />
                            <span>Envoyer un mail</span>
                        </a>
                    )}
                    {company?.contact?.phone && (
                        <a href={`tel:${company.contact.phone}`} className={styles.contactLink}>
                            <PhoneIcon />
                            <span>Appeler</span>
                        </a>
                    )}
                </div>
                <div className={styles.cardButtons}>
                    {onToggleSave && (
                        <ActionButton
                            icon={isSaved ? BookmarkIcon : BookmarkBorderIcon}
                            onClick={onToggleSave}
                            filled={isSaved}
                        />
                    )}
                    <ActionButton icon={ArrowRightIcon} reversed filled onClick={onLearnMore}>
                        En savoir plus
                    </ActionButton>
                </div>
            </div>
        </article>
    );
}
