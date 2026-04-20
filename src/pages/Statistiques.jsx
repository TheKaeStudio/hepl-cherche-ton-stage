import { useState, useEffect } from "react";
import { getInternships } from "@/api/internships";
import { getUsers } from "@/api/users";
import { getCompanies } from "@/api/companies";
import styles from "./Statistiques.module.scss";

import AssignmentIcon from "@mui/icons-material/AssignmentOutlined";
import SchoolIcon from "@mui/icons-material/SchoolOutlined";
import DomainIcon from "@mui/icons-material/DomainOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircleOutlined";

const STATUS_LABEL = {
    assigned:    "Assigné",
    in_progress: "En cours",
    submitted:   "Soumis",
    validated:   "Validé",
    rejected:    "Rejeté",
};

const STATUS_COLOR = {
    assigned:    "#6b7280",
    in_progress: "#3b82f6",
    submitted:   "#f97316",
    validated:   "#22c55e",
    rejected:    "#ef4444",
};

function Bar({ label, value, max, color }) {
    const pct = max > 0 ? Math.round((value / max) * 100) : 0;
    return (
        <div className={styles.barRow}>
            <span className={styles.barLabel}>{label}</span>
            <div className={styles.barTrack}>
                <div className={styles.barFill} style={{ width: `${pct}%`, background: color }} />
            </div>
            <span className={styles.barValue}>{value}</span>
        </div>
    );
}

export default function Statistiques() {
    const [internships, setInternships] = useState([]);
    const [studentCount, setStudentCount] = useState(0);
    const [companyCount, setCompanyCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([getInternships(), getUsers(), getCompanies()])
            .then(([intern, users, companies]) => {
                setInternships(intern);
                setStudentCount(users.filter((u) => u.role === "etudiant").length);
                setCompanyCount(companies.length);
            })
            .finally(() => setLoading(false));
    }, []);

    const statusCounts = internships.reduce((acc, s) => {
        acc[s.status] = (acc[s.status] ?? 0) + 1;
        return acc;
    }, {});

    const groupCounts = internships.reduce((acc, s) => {
        const g = s.group ?? "Non assigné";
        acc[g] = (acc[g] ?? 0) + 1;
        return acc;
    }, {});

    const maxStatus = Math.max(...Object.values(statusCounts), 1);
    const maxGroup  = Math.max(...Object.values(groupCounts), 1);

    const SUMMARY = [
        { label: "Total stages",    value: internships.length,                          Icon: AssignmentIcon,  color: "#f97316", bg: "#fff7ed" },
        { label: "Étudiants",       value: studentCount,                                Icon: SchoolIcon,      color: "#3b82f6", bg: "#eff6ff" },
        { label: "Entreprises",     value: companyCount,                                Icon: DomainIcon,      color: "#22c55e", bg: "#f0fdf4" },
        { label: "Stages validés",  value: statusCounts["validated"] ?? 0,             Icon: CheckCircleIcon, color: "#a855f7", bg: "#faf5ff" },
    ];

    return (
        <section className={styles.page}>
            <div className="sectionHeader">
                <h2>Statistiques</h2>
                <p>Vue d'ensemble de la plateforme.</p>
            </div>

            {loading ? (
                <p style={{ color: "var(--text)", fontSize: "14px" }}>Chargement…</p>
            ) : (
                <>
                    <div className={styles.summaryGrid}>
                        {SUMMARY.map(({ label, value, Icon, color, bg }) => (
                            <div key={label} className={styles.statCard}>
                                <div className={styles.statIcon} style={{ background: bg, color }}>
                                    <Icon />
                                </div>
                                <div>
                                    <p className={styles.statValue}>{value}</p>
                                    <p className={styles.statLabel}>{label}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={styles.chartsGrid}>
                        <div className={styles.chartCard}>
                            <p className={styles.chartTitle}>Stages par statut</p>
                            <div className={styles.bars}>
                                {Object.keys(STATUS_LABEL).map((status) => (
                                    <Bar
                                        key={status}
                                        label={STATUS_LABEL[status]}
                                        value={statusCounts[status] ?? 0}
                                        max={maxStatus}
                                        color={STATUS_COLOR[status]}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className={styles.chartCard}>
                            <p className={styles.chartTitle}>Stages par groupe</p>
                            <div className={styles.bars}>
                                {Object.entries(groupCounts).map(([group, count]) => (
                                    <Bar
                                        key={group}
                                        label={group}
                                        value={count}
                                        max={maxGroup}
                                        color="var(--accent)"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </section>
    );
}
