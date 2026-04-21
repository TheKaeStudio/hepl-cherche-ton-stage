import { useNavigate } from "react-router-dom";
import Tag from "@/components/ui/Tag/Tag";
import styles from "./StageCard.module.scss";

import EmailIcon from "@mui/icons-material/EmailOutlined";
import PhoneIcon from "@mui/icons-material/PhoneOutlined";
import ArrowIcon from "@mui/icons-material/ArrowForwardOutlined";
import WarnIcon  from "@mui/icons-material/WarningAmberOutlined";

export default function StageCard({ stage }) {
    const navigate = useNavigate();

    const nd = "Non défini";
    const company    = stage.companyName ?? nd;
    const supervisor = stage.supervisor?.name ?? nd;
    const teacher    = stage.teacherName ?? nd;
    const group      = stage.group ?? nd;
    const schoolYear = stage.schoolYear ?? nd;

    const dateRange = stage.startDate && stage.endDate
        ? `${new Date(stage.startDate).toLocaleDateString("fr-BE", { day: "numeric", month: "short", year: "numeric" })} → ${new Date(stage.endDate).toLocaleDateString("fr-BE", { day: "numeric", month: "short", year: "numeric" })}`
        : nd;

    return (
        <article className={`${styles.card} ${stage.isLate ? styles.late : ""}`}>
            <div className={styles.header}>
                <div className={styles.titleRow}>
                    <h3 className={styles.title}>{stage.typeLabel ?? stage.type ?? "Stage"}</h3>
                    {stage.isLate && (
                        <span className={styles.lateTag}><WarnIcon /> En retard</span>
                    )}
                </div>
                <ul className={styles.tags}>
                    <Tag status={stage.status} />
                </ul>
            </div>

            <dl className={styles.grid}>
                <div className={styles.item}>
                    <dt>Entreprise</dt>
                    <dd className={company === nd ? styles.nd : ""}>{company}</dd>
                </div>
                <div className={styles.item}>
                    <dt>Responsable de stage</dt>
                    <dd className={supervisor === nd ? styles.nd : ""}>{supervisor}</dd>
                </div>
                <div className={styles.item}>
                    <dt>Enseignant responsable</dt>
                    <dd className={teacher === nd ? styles.nd : ""}>{teacher}</dd>
                </div>
                <div className={styles.item}>
                    <dt>Durée</dt>
                    <dd className={dateRange === nd ? styles.nd : ""}>{dateRange}</dd>
                </div>
                <div className={styles.item}>
                    <dt>Groupe</dt>
                    <dd className={group === nd ? styles.nd : ""}>{group}</dd>
                </div>
                <div className={styles.item}>
                    <dt>Année scolaire</dt>
                    <dd className={schoolYear === nd ? styles.nd : ""}>{schoolYear}</dd>
                </div>
            </dl>

            <div className={styles.footer}>
                <div className={styles.contacts}>
                    {stage.supervisor?.email && (
                        <a href={`mailto:${stage.supervisor.email}`} className={styles.contactBtn}>
                            <EmailIcon /> Envoyer un mail
                        </a>
                    )}
                    {stage.supervisor?.phone && (
                        <a href={`tel:${stage.supervisor.phone}`} className={styles.contactBtn}>
                            <PhoneIcon /> Appeler
                        </a>
                    )}
                </div>
                <button className={styles.moreBtn} onClick={() => navigate(`/stages/${stage.id}`)}>
                    En savoir plus <ArrowIcon />
                </button>
            </div>
        </article>
    );
}
