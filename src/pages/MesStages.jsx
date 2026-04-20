import { useState, useEffect } from "react";
import { getInternships } from "@/api/internships";
import StageCard from "@/components/ui/StageCard/StageCard";
import StageSheet from "@/components/sheets/StageSheet";
import styles from "./MesStages.module.scss";

import UploadIcon from "@mui/icons-material/UploadFileOutlined";
import CheckIcon from "@mui/icons-material/CheckCircleOutlined";
import PendingIcon from "@mui/icons-material/HourglassEmptyOutlined";
import DownloadIcon from "@mui/icons-material/DownloadOutlined";
import AssignmentIcon from "@mui/icons-material/AssignmentOutlined";
import FolderIcon from "@mui/icons-material/FolderOutlined";

const DOCUMENTS = [
    { id: "convention", label: "Convention de stage",    required: true,  hint: "PDF signé par l'entreprise et l'école" },
    { id: "rapport",    label: "Rapport de stage",       required: true,  hint: "Document final en PDF" },
    { id: "evaluation", label: "Évaluation entreprise",  required: false, hint: "Formulaire rempli par le maître de stage" },
    { id: "carnet",     label: "Carnet de bord",         required: false, hint: "Suivi journalier de vos activités" },
];

export default function MesStages() {
    const [tab, setTab] = useState("stages");
    const [myStages, setMyStages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStage, setSelectedStage] = useState(null);
    const [files, setFiles] = useState({});

    useEffect(() => {
        getInternships().then(setMyStages).finally(() => setLoading(false));
    }, []);

    function handleUpload(docId, e) {
        const file = e.target.files?.[0];
        if (!file) return;
        setFiles((prev) => ({ ...prev, [docId]: file }));
    }

    return (
        <>
            <section>
                <div className="sectionHeader">
                    <h2>Mon stage</h2>
                    <p>Consultez vos stages et gérez votre dossier.</p>
                </div>

                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${tab === "stages" ? styles.tabActive : ""}`}
                        onClick={() => setTab("stages")}
                    >
                        <AssignmentIcon /> Mes stages
                    </button>
                    <button
                        className={`${styles.tab} ${tab === "dossier" ? styles.tabActive : ""}`}
                        onClick={() => setTab("dossier")}
                    >
                        <FolderIcon /> Mon dossier
                    </button>
                </div>

                {tab === "stages" && (
                    <div className={styles.list}>
                        {loading ? (
                            <p>Chargement…</p>
                        ) : myStages.length === 0 ? (
                            <p>Aucun stage enregistré.</p>
                        ) : (
                            myStages.map((stage) => (
                                <StageCard
                                    key={stage.id}
                                    stage={stage}
                                    onLearnMore={() => setSelectedStage(stage)}
                                />
                            ))
                        )}
                    </div>
                )}

                {tab === "dossier" && (
                    <div className={styles.dossier}>
                        <div className={styles.docList}>
                            {DOCUMENTS.map((doc) => {
                                const uploaded = !!files[doc.id];
                                return (
                                    <div
                                        key={doc.id}
                                        className={`${styles.docCard} ${uploaded ? styles.done : ""}`}
                                    >
                                        <div className={styles.docStatus}>
                                            {uploaded
                                                ? <CheckIcon className={styles.iconDone} />
                                                : <PendingIcon className={styles.iconPending} />
                                            }
                                        </div>
                                        <div className={styles.docInfo}>
                                            <div className={styles.docTitleRow}>
                                                <p className={styles.docLabel}>{doc.label}</p>
                                                {doc.required && (
                                                    <span className={styles.required}>Obligatoire</span>
                                                )}
                                            </div>
                                            <p className={styles.docHint}>{doc.hint}</p>
                                            {uploaded && (
                                                <p className={styles.fileName}>{files[doc.id].name}</p>
                                            )}
                                        </div>
                                        <div className={styles.docActions}>
                                            {uploaded && (
                                                <button className={styles.iconBtn} title="Télécharger">
                                                    <DownloadIcon />
                                                </button>
                                            )}
                                            <label className={styles.uploadBtn}>
                                                <UploadIcon />
                                                <span>{uploaded ? "Remplacer" : "Déposer"}</span>
                                                <input
                                                    type="file"
                                                    accept=".pdf,.doc,.docx"
                                                    hidden
                                                    onChange={(e) => handleUpload(doc.id, e)}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className={styles.progress}>
                            <p className={styles.progressLabel}>
                                Documents déposés : {Object.keys(files).length} / {DOCUMENTS.filter((d) => d.required).length} obligatoires
                            </p>
                            <div className={styles.progressBar}>
                                <div
                                    className={styles.progressFill}
                                    style={{ width: `${(Object.keys(files).length / DOCUMENTS.length) * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </section>

            <StageSheet stage={selectedStage} onClose={() => setSelectedStage(null)} />
        </>
    );
}
