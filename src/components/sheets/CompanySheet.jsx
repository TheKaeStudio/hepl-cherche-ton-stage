import { useAuth } from "@/contexts/AuthContext";
import { useCompanyFields } from "@/contexts/CompanyFieldsContext";
import RightSheet from "@/components/ui/RightSheet/RightSheet";
import InfoGrid from "@/components/ui/InfoGrid/InfoGrid";
import Tag from "@/components/ui/Tag/Tag";
import styles from "./CompanySheet.module.scss";

import EmailIcon  from "@mui/icons-material/EmailOutlined";
import PhoneIcon  from "@mui/icons-material/PhoneOutlined";
import CheckIcon  from "@mui/icons-material/CheckCircleOutlined";
import CloseIcon  from "@mui/icons-material/CancelOutlined";
import DomainIcon from "@mui/icons-material/Domain";
import LockIcon   from "@mui/icons-material/LockOutlined";

export default function CompanySheet({ company, onClose }) {
    const { user } = useAuth();
    const { fields } = useCompanyFields();
    const isEducator   = ["teacher", "manager", "admin"].includes(user?.role);
    const isPrivileged = user?.role === "admin" || user?.role === "manager";

    const customValues = company?.customValues ?? {};

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

                    {(company.domains?.length > 0 || company.tags?.length > 0) && (
                        <div className={styles.tagsSection}>
                            {company.domains?.length > 0 && (
                                <div className={styles.tagGroup}>
                                    <p className={styles.tagGroupLabel}>Domaines</p>
                                    <ul className={styles.tagList}>
                                        {company.domains.map((d) => <Tag key={d} name={d} />)}
                                    </ul>
                                </div>
                            )}
                            {company.tags?.length > 0 && (
                                <div className={styles.tagGroup}>
                                    <p className={styles.tagGroupLabel}>Secteurs</p>
                                    <ul className={styles.tagList}>
                                        {company.tags.map((t) => <Tag key={t} name={t} />)}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    {company.description && (
                        <p className={styles.description}>{company.description}</p>
                    )}

                    {fields.length > 0 && (
                        <InfoGrid columns={2}>
                            {fields.map((field) => {
                                const val = !!customValues[field._id];
                                return (
                                    <InfoGrid.Item key={field._id} label={field.label}>
                                        <span className={val ? styles.yes : styles.no}>
                                            {val
                                                ? <><CheckIcon /> Oui</>
                                                : <><CloseIcon /> Non</>
                                            }
                                        </span>
                                    </InfoGrid.Item>
                                );
                            })}
                            {company.website && (
                                <InfoGrid.Item label="Site web">{company.website}</InfoGrid.Item>
                            )}
                        </InfoGrid>
                    )}

                    {(company.contacts?.length > 0) && (
                        <div className={styles.contactSection}>
                            <p className={styles.sectionLabel}>
                                {company.contacts.length > 1 ? "Contacts" : "Contact"}
                            </p>
                            {company.contacts.map((ct, i) => (
                                <div key={i} className={i > 0 ? styles.contactSeparator : undefined}>
                                    <div className={styles.contactHeader}>
                                        <p className={styles.contactName}>{ct.name}</p>
                                        {ct.visibility === "private" && isEducator && (
                                            <span className={styles.privateBadge} title="Contact privé">
                                                <LockIcon fontSize="inherit" /> Privé
                                            </span>
                                        )}
                                    </div>
                                    {ct.email && (
                                        <a href={`mailto:${ct.email}`} className={styles.contactLink}>
                                            <EmailIcon />
                                            {ct.email}
                                        </a>
                                    )}
                                    {ct.phone && (
                                        <a href={`tel:${ct.phone}`} className={styles.contactLink}>
                                            <PhoneIcon />
                                            {ct.phone}
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                    {company.teacherInfo && (
                        <div className={styles.privateSection}>
                            <p className={styles.sectionLabel}>
                                <LockIcon fontSize="inherit" /> Informations aux enseignants
                            </p>
                            <p className={styles.privateText}>{company.teacherInfo}</p>
                        </div>
                    )}
                    {company.teacherNotes && (
                        <div className={styles.privateSection}>
                            <p className={styles.sectionLabel}>
                                <LockIcon fontSize="inherit" /> Notes des enseignants
                            </p>
                            <p className={styles.privateText}>{company.teacherNotes}</p>
                        </div>
                    )}
                </>
            )}
        </RightSheet>
    );
}
