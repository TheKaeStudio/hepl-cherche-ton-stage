import { useState } from "react";
import styles from "./MonDossier.module.scss";

import UploadIcon from "@mui/icons-material/UploadFileOutlined";
import CheckIcon from "@mui/icons-material/CheckCircleOutlined";
import PendingIcon from "@mui/icons-material/HourglassEmptyOutlined";
import DownloadIcon from "@mui/icons-material/DownloadOutlined";

const DOCUMENTS = [
    { id: "convention", label: "Convention de stage", required: true,  hint: "PDF signé par l'entreprise et l'école" },
    { id: "rapport",    label: "Rapport de stage",    required: true,  hint: "Document final en PDF" },
    { id: "evaluation", label: "Évaluation entreprise", required: false, hint: "Formulaire d'évaluation rempli par le maître de stage" },
    { id: "carnet",     label: "Carnet de bord",      required: false, hint: "Suivi journalier de vos activités" },
];

export default function MonDossier() {
    const [files, setFiles] = useState({});

    function handleUpload(docId, e) {
        const file = e.target.files?.[0];
        if (!file) return;
        setFiles((prev) => ({ ...prev, [docId]: file }));
    }

    return (
        <section className={styles.page}>
            <div className="sectionHeader">
                <h2>Mon dossier de stage</h2>
                <p>Déposez vos documents obligatoires pour valider votre stage.</p>
            </div>

            <div className={styles.docList}>
                {DOCUMENTS.map((doc) => {
                    const uploaded = !!files[doc.id];
                    return (
                        <div key={doc.id} className={`${styles.docCard} ${uploaded ? styles.done : ""}`}>
                            <div className={styles.docStatus}>
                                {uploaded
                                    ? <CheckIcon className={styles.iconDone} />
                                    : <PendingIcon className={styles.iconPending} />
                                }
                            </div>

                            <div className={styles.docInfo}>
                                <div className={styles.docTitleRow}>
                                    <p className={styles.docLabel}>{doc.label}</p>
                                    {doc.required && <span className={styles.required}>Obligatoire</span>}
                                </div>
                                <p className={styles.docHint}>{doc.hint}</p>
                                {uploaded && (
                                    <p className={styles.fileName}>{files[doc.id].name}</p>
                                )}
                            </div>

                            <div className={styles.docActions}>
                                {uploaded && (
                                    <button className={styles.downloadBtn} title="Télécharger">
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
                        style={{
                            width: `${(Object.keys(files).length / DOCUMENTS.length) * 100}%`,
                        }}
                    />
                </div>
            </div>
        </section>
    );
}
