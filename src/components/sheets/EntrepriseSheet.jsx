import RightSheet from "@/components/ui/RightSheet/RightSheet";
import InfoGrid from "@/components/ui/InfoGrid/InfoGrid";
import styles from "./EntrepriseSheet.module.scss";
import EmailIcon from "@mui/icons-material/EmailOutlined";
import PhoneIcon from "@mui/icons-material/PhoneOutlined";
import CheckIcon from "@mui/icons-material/CheckCircleOutlined";
import CloseIcon from "@mui/icons-material/CancelOutlined";
import DomainIcon from "@mui/icons-material/Domain";

export default function EntrepriseSheet({ company, onClose }) {
    return (
        <RightSheet isOpen={!!company} onClose={onClose} title="Détails de l'entreprise">
            {company && (
                <>
                    <div className={styles.header}>
                        <div className={styles.logoWrap}>
                            {company.logo
                                ? <img src={company.logo} alt={company.name} />
                                : <DomainIcon />
                            }
                        </div>
                        <div className={styles.headerText}>
                            <h2 className={styles.name}>{company.name}</h2>
                            {company.province && <p className={styles.province}>{company.province}</p>}
                        </div>
                    </div>

                    {company.description && (
                        <p className={styles.description}>{company.description}</p>
                    )}

                    <InfoGrid columns={2}>
                        <InfoGrid.Item label="Stage observation">
                            <span className={company.offresObservation ? styles.yes : styles.no}>
                                {company.offresObservation ? (
                                    <><CheckIcon /> Oui</>
                                ) : (
                                    <><CloseIcon /> Non</>
                                )}
                            </span>
                        </InfoGrid.Item>
                        <InfoGrid.Item label="Stage BAC3">
                            <span className={company.offres3e ? styles.yes : styles.no}>
                                {company.offres3e ? (
                                    <><CheckIcon /> Oui</>
                                ) : (
                                    <><CloseIcon /> Non</>
                                )}
                            </span>
                        </InfoGrid.Item>
                        {company.website && (
                            <InfoGrid.Item label="Site web">{company.website}</InfoGrid.Item>
                        )}
                    </InfoGrid>

                    {company.contact && (
                        <div className={styles.contactSection}>
                            <p className={styles.sectionLabel}>Contact</p>
                            <p className={styles.contactName}>{company.contact.name}</p>
                            {company.contact.email && (
                                <a href={`mailto:${company.contact.email}`} className={styles.contactLink}>
                                    <EmailIcon />
                                    {company.contact.email}
                                </a>
                            )}
                            {company.contact.phone && (
                                <a href={`tel:${company.contact.phone}`} className={styles.contactLink}>
                                    <PhoneIcon />
                                    {company.contact.phone}
                                </a>
                            )}
                        </div>
                    )}
                </>
            )}
        </RightSheet>
    );
}
