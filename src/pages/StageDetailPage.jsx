import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
    getInternship,
    updateSheet,
    submitSheet,
    validateSheet,
    submitDocs,
    confirmDocs,
    getComments,
    addComment,
    deleteComment,
} from "@/api/internships";
import { getCompanies } from "@/api/companies";
import Tag from "@/components/ui/Tag/Tag";
import styles from "./StageDetailPage.module.scss";

import ArrowBackIcon from "@mui/icons-material/ArrowBackOutlined";
import WarnIcon      from "@mui/icons-material/WarningAmberOutlined";
import SaveIcon      from "@mui/icons-material/SaveOutlined";
import SendIcon      from "@mui/icons-material/SendOutlined";
import CheckIcon     from "@mui/icons-material/CheckCircleOutlined";
import CloseIcon     from "@mui/icons-material/CancelOutlined";
import UploadIcon    from "@mui/icons-material/UploadFileOutlined";
import DeleteIcon    from "@mui/icons-material/DeleteOutlineOutlined";

const EMPTY_SHEET = {
    companyType: "existing",
    selectedCompanyId: "",
    externalCompanyName: "",
    startDate: "",
    endDate: "",
    missions: "",
    description: "",
    tutorName: "",
    tutorEmail: "",
    tutorPhone: "",
};

function initSheet(stage) {
    return {
        companyType: stage.sheetCompanyType ?? "existing",
        selectedCompanyId: stage.company?.id ?? "",
        externalCompanyName: stage.externalCompanyName ?? "",
        startDate: stage.startDate ? stage.startDate.substring(0, 10) : "",
        endDate: stage.endDate ? stage.endDate.substring(0, 10) : "",
        missions: (stage.missions ?? []).join("\n"),
        description: stage.description ?? "",
        tutorName: stage.supervisor?.name ?? "",
        tutorEmail: stage.supervisor?.email ?? "",
        tutorPhone: stage.supervisor?.phone ?? "",
    };
}

function fmtDate(d) {
    if (!d) return null;
    return new Date(d).toLocaleDateString("fr-BE", { day: "numeric", month: "short", year: "numeric" });
}

export default function StageDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [stage,            setStage]            = useState(null);
    const [loading,          setLoading]          = useState(true);
    const [companies,        setCompanies]        = useState([]);
    const [sheetForm,        setSheetForm]        = useState(EMPTY_SHEET);
    const [convention,       setConvention]       = useState(null);
    const [report,           setReport]           = useState(null);
    const [reviewComment,    setReviewComment]    = useState("");
    const [docsReviewComment,setDocsReviewComment]= useState("");
    const [comments,         setComments]         = useState([]);
    const [newComment,       setNewComment]       = useState("");
    const [saving,           setSaving]           = useState(false);
    const [submitting,       setSubmitting]       = useState(false);
    const [reviewing,        setReviewing]        = useState(false);
    const [commenting,       setCommenting]       = useState(false);

    const isStudent = user?.role === "student";
    const isManager = ["manager", "admin"].includes(user?.role);
    const isTeacher = user?.role === "teacher";
    const isAdmin   = user?.role === "admin";

    useEffect(() => {
        Promise.all([getInternship(id), getComments(id), getCompanies()])
            .then(([s, c, companyList]) => {
                setStage(s);
                setSheetForm(initSheet(s));
                setComments(c);
                setCompanies(companyList);
            })
            .finally(() => setLoading(false));
    }, [id]);

    // ─── Field helper ────────────────────────────────────────────────────────

    function sf(key) {
        return (e) => setSheetForm((prev) => ({ ...prev, [key]: e.target.value }));
    }

    // ─── Sheet ───────────────────────────────────────────────────────────────

    function buildPayload() {
        return {
            startDate:   sheetForm.startDate  || undefined,
            endDate:     sheetForm.endDate    || undefined,
            missions:    sheetForm.missions.split("\n").map((m) => m.trim()).filter(Boolean),
            description: sheetForm.description || undefined,
            companyTutor: {
                name:  sheetForm.tutorName  || undefined,
                email: sheetForm.tutorEmail || undefined,
                phone: sheetForm.tutorPhone || undefined,
            },
            companyType:         sheetForm.companyType,
            companyId:           sheetForm.companyType === "existing" ? sheetForm.selectedCompanyId || undefined : undefined,
            externalCompanyName: sheetForm.companyType === "external" ? sheetForm.externalCompanyName : undefined,
        };
    }

    async function handleSaveDraft() {
        setSaving(true);
        try {
            const updated = await updateSheet(id, buildPayload());
            setStage(updated);
        } finally {
            setSaving(false);
        }
    }

    async function handleSubmitSheet() {
        setSubmitting(true);
        try {
            await updateSheet(id, buildPayload());
            const updated = await submitSheet(id);
            setStage(updated);
        } finally {
            setSubmitting(false);
        }
    }

    async function handleValidateSheet(status) {
        setReviewing(true);
        try {
            const updated = await validateSheet(id, { status, comment: reviewComment });
            setStage(updated);
            setReviewComment("");
        } finally {
            setReviewing(false);
        }
    }

    // ─── Docs ────────────────────────────────────────────────────────────────

    async function handleSubmitDocs() {
        if (!convention || !report) return;
        setSubmitting(true);
        try {
            const fd = new FormData();
            fd.append("convention", convention);
            fd.append("report", report);
            const updated = await submitDocs(id, fd);
            setStage(updated);
            setConvention(null);
            setReport(null);
        } finally {
            setSubmitting(false);
        }
    }

    async function handleConfirmDocs(status) {
        setReviewing(true);
        try {
            const updated = await confirmDocs(id, { status, comment: docsReviewComment });
            setStage(updated);
            setDocsReviewComment("");
        } finally {
            setReviewing(false);
        }
    }

    // ─── Comments ────────────────────────────────────────────────────────────

    async function handleAddComment() {
        if (!newComment.trim()) return;
        setCommenting(true);
        try {
            const c = await addComment(id, newComment.trim());
            setComments((prev) => [...prev, c]);
            setNewComment("");
        } finally {
            setCommenting(false);
        }
    }

    async function handleDeleteComment(commentId) {
        await deleteComment(id, commentId);
        setComments((prev) => prev.filter((c) => c.id !== commentId));
    }

    // ─── Render ──────────────────────────────────────────────────────────────

    if (loading) return <section><p>Chargement…</p></section>;
    if (!stage)  return <section><p>Stage introuvable.</p></section>;

    const nd        = "Non défini";
    const company   = stage.companyName ?? nd;
    const supervisor= stage.supervisor?.name ?? nd;
    const teacher   = stage.teacherName ?? nd;
    const group     = stage.group ?? nd;
    const schoolYear= stage.schoolYear ?? nd;
    const dateRange = stage.startDate && stage.endDate
        ? `${fmtDate(stage.startDate)} → ${fmtDate(stage.endDate)}`
        : nd;

    const canEditSheet    = isStudent && ["assigned", "rejected"].includes(stage.status);
    const canValidateSheet= isManager && stage.status === "submitted";
    const canUploadDocs   = isStudent && ["validated", "docs_rejected"].includes(stage.status);
    const canConfirmDocs  = (isManager || isTeacher) && stage.status === "docs_submitted";
    const showTask2       = ["validated", "docs_submitted", "docs_rejected", "completed"].includes(stage.status);

    return (
        <section>
            <button className={styles.backBtn} onClick={() => navigate(-1)}>
                <ArrowBackIcon /> Retour
            </button>

            {/* ─── Header ─────────────────────────────────────────────────────── */}
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <h2 className={styles.title}>
                        {stage.typeLabel ?? stage.type ?? "Stage"}
                    </h2>
                    {stage.isLate && (
                        <span className={styles.lateTag}>
                            <WarnIcon /> En retard
                        </span>
                    )}
                </div>
                <Tag status={stage.status} />
            </div>

            {/* ─── Info grid ──────────────────────────────────────────────────── */}
            <dl className={styles.infoGrid}>
                {[
                    ["Entreprise", company, company === nd],
                    ["Responsable de stage", supervisor, supervisor === nd],
                    ["Enseignant responsable", teacher, teacher === nd],
                    ["Durée", dateRange, dateRange === nd],
                    ["Groupe", group, group === nd],
                    ["Année scolaire", schoolYear, schoolYear === nd],
                ].map(([label, value, isNd]) => (
                    <div key={label} className={styles.infoItem}>
                        <dt>{label}</dt>
                        <dd className={isNd ? styles.nd : ""}>{value}</dd>
                    </div>
                ))}
            </dl>

            {/* ─── Rejection banners ──────────────────────────────────────────── */}
            {stage.status === "rejected" && stage.evaluation?.comment && (
                <div className={styles.rejectionBanner}>
                    <CloseIcon /> <strong>Motif de rejet :</strong>{" "}
                    {stage.evaluation.comment}
                </div>
            )}
            {stage.status === "docs_rejected" && stage.docsRejectionComment && (
                <div className={styles.rejectionBanner}>
                    <CloseIcon /> <strong>Motif de rejet :</strong>{" "}
                    {stage.docsRejectionComment}
                </div>
            )}

            {/* ─── Task 1: Sheet ──────────────────────────────────────────────── */}
            <div className={styles.taskCard}>
                <div className={styles.taskHeader}>
                    <span className={styles.taskNumber}>1</span>
                    <h3 className={styles.taskTitle}>Informations du stage</h3>
                    {[
                        "submitted",
                        "validated",
                        "docs_submitted",
                        "docs_rejected",
                        "completed",
                    ].includes(stage.status) && (
                        <span className={styles.taskBadgeDone}>
                            <CheckIcon /> Soumis
                        </span>
                    )}
                </div>

                {/* Student editable form */}
                {canEditSheet && (
                    <div className={styles.form}>
                        <div className={styles.formSection}>
                            <p className={styles.fieldLabel}>
                                Type d'entreprise
                            </p>
                            <div className={styles.radioGroup}>
                                <label>
                                    <input
                                        type="radio"
                                        value="existing"
                                        checked={
                                            sheetForm.companyType === "existing"
                                        }
                                        onChange={sf("companyType")}
                                    />
                                    Entreprise partenaire
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        value="external"
                                        checked={
                                            sheetForm.companyType === "external"
                                        }
                                        onChange={sf("companyType")}
                                    />
                                    Autre entreprise
                                </label>
                            </div>
                            {sheetForm.companyType === "existing" && (
                                <select
                                    className={styles.input}
                                    value={sheetForm.selectedCompanyId}
                                    onChange={sf("selectedCompanyId")}
                                >
                                    <option value="">— Sélectionner une entreprise —</option>
                                    {companies.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            )}
                            {sheetForm.companyType === "external" && (
                                <input
                                    type="text"
                                    className={styles.input}
                                    placeholder="Nom de l'entreprise"
                                    value={sheetForm.externalCompanyName}
                                    onChange={sf("externalCompanyName")}
                                />
                            )}
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.fieldLabel}>
                                    Date de début
                                </label>
                                <input
                                    type="date"
                                    className={styles.input}
                                    value={sheetForm.startDate}
                                    onChange={sf("startDate")}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.fieldLabel}>
                                    Date de fin
                                </label>
                                <input
                                    type="date"
                                    className={styles.input}
                                    value={sheetForm.endDate}
                                    onChange={sf("endDate")}
                                />
                            </div>
                        </div>

                        <div className={styles.formSection}>
                            <p className={styles.fieldLabel}>
                                Responsable en entreprise
                            </p>
                            <div className={styles.formRow}>
                                <input
                                    type="text"
                                    className={styles.input}
                                    placeholder="Nom complet"
                                    value={sheetForm.tutorName}
                                    onChange={sf("tutorName")}
                                />
                                <input
                                    type="email"
                                    className={styles.input}
                                    placeholder="Email"
                                    value={sheetForm.tutorEmail}
                                    onChange={sf("tutorEmail")}
                                />
                                <input
                                    type="tel"
                                    className={styles.input}
                                    placeholder="Téléphone"
                                    value={sheetForm.tutorPhone}
                                    onChange={sf("tutorPhone")}
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.fieldLabel}>
                                Missions (une par ligne)
                            </label>
                            <textarea
                                className={styles.textarea}
                                rows={4}
                                value={sheetForm.missions}
                                onChange={sf("missions")}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.fieldLabel}>
                                Description générale
                            </label>
                            <textarea
                                className={styles.textarea}
                                rows={4}
                                value={sheetForm.description}
                                onChange={sf("description")}
                            />
                        </div>

                        <div className={styles.formActions}>
                            <button
                                className={styles.secondaryBtn}
                                onClick={handleSaveDraft}
                                disabled={saving}
                            >
                                <SaveIcon />{" "}
                                {saving ? "Sauvegarde…" : "Sauvegarder"}
                            </button>
                            <button
                                className={styles.primaryBtn}
                                onClick={handleSubmitSheet}
                                disabled={submitting}
                            >
                                <SendIcon />{" "}
                                {submitting ? "Envoi…" : "Soumettre"}
                            </button>
                        </div>
                    </div>
                )}

                {/* Student submitted — pending banner */}
                {isStudent && stage.status === "submitted" && (
                    <p className={styles.pendingNote}>
                        Votre fiche est en attente de validation par votre
                        responsable.
                    </p>
                )}

                {/* Read-only summary */}
                {!canEditSheet && (
                    <dl className={styles.sheetSummary}>
                        <div className={styles.infoItem}>
                            <dt>Entreprise</dt>
                            <dd className={!stage.companyName ? styles.nd : ""}>
                                {stage.companyName ?? nd}
                            </dd>
                        </div>
                        <div className={styles.infoItem}>
                            <dt>Responsable en entreprise</dt>
                            <dd className={!stage.supervisor ? styles.nd : ""}>
                                {stage.supervisor
                                    ? [
                                          stage.supervisor.name,
                                          stage.supervisor.email,
                                          stage.supervisor.phone,
                                      ]
                                          .filter(Boolean)
                                          .join(" — ")
                                    : nd}
                            </dd>
                        </div>
                        <div className={styles.infoItem}>
                            <dt>Période</dt>
                            <dd className={dateRange === nd ? styles.nd : ""}>
                                {dateRange}
                            </dd>
                        </div>
                        {stage.missions?.length > 0 && (
                            <div
                                className={`${styles.infoItem} ${styles.infoItemFull}`}
                            >
                                <dt>Missions</dt>
                                <dd>
                                    <ul className={styles.missionList}>
                                        {stage.missions.map((m, i) => (
                                            <li key={i}>{m}</li>
                                        ))}
                                    </ul>
                                </dd>
                            </div>
                        )}
                        {stage.description && (
                            <div
                                className={`${styles.infoItem} ${styles.infoItemFull}`}
                            >
                                <dt>Description</dt>
                                <dd>{stage.description}</dd>
                            </div>
                        )}
                    </dl>
                )}

                {/* Manager validation form */}
                {canValidateSheet && (
                    <div className={styles.reviewForm}>
                        <textarea
                            className={styles.textarea}
                            rows={3}
                            placeholder="Commentaire (obligatoire pour refus)"
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                        />
                        <div className={styles.reviewActions}>
                            <button
                                className={styles.rejectBtn}
                                onClick={() => handleValidateSheet("rejected")}
                                disabled={reviewing || !reviewComment.trim()}
                            >
                                <CloseIcon /> Refuser
                            </button>
                            <button
                                className={styles.approveBtn}
                                onClick={() => handleValidateSheet("validated")}
                                disabled={reviewing}
                            >
                                <CheckIcon /> Valider
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* ─── Task 2: Documents ──────────────────────────────────────────── */}
            {showTask2 && (
                <div className={styles.taskCard}>
                    <div className={styles.taskHeader}>
                        <span className={styles.taskNumber}>2</span>
                        <h3 className={styles.taskTitle}>Documents</h3>
                        {stage.status === "completed" && (
                            <span className={styles.taskBadgeDone}>
                                <CheckIcon /> Confirmé
                            </span>
                        )}
                        {stage.status === "docs_submitted" && (
                            <span className={styles.taskBadgePending}>
                                En attente
                            </span>
                        )}
                    </div>

                    {canUploadDocs && (
                        <div className={styles.form}>
                            <div className={styles.uploadRow}>
                                <div className={styles.uploadItem}>
                                    <p className={styles.fieldLabel}>
                                        Convention de stage{" "}
                                        <span className={styles.required}>
                                            *
                                        </span>
                                    </p>
                                    <label
                                        className={`${styles.uploadLabel} ${convention ? styles.uploadLabelDone : ""}`}
                                    >
                                        <UploadIcon />
                                        <span>
                                            {convention
                                                ? convention.name
                                                : "Choisir un PDF"}
                                        </span>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            hidden
                                            onChange={(e) =>
                                                setConvention(
                                                    e.target.files?.[0] ?? null,
                                                )
                                            }
                                        />
                                    </label>
                                </div>
                                <div className={styles.uploadItem}>
                                    <p className={styles.fieldLabel}>
                                        Rapport de stage{" "}
                                        <span className={styles.required}>
                                            *
                                        </span>
                                    </p>
                                    <label
                                        className={`${styles.uploadLabel} ${report ? styles.uploadLabelDone : ""}`}
                                    >
                                        <UploadIcon />
                                        <span>
                                            {report
                                                ? report.name
                                                : "Choisir un PDF"}
                                        </span>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            hidden
                                            onChange={(e) =>
                                                setReport(
                                                    e.target.files?.[0] ?? null,
                                                )
                                            }
                                        />
                                    </label>
                                </div>
                            </div>
                            <div className={styles.formActions}>
                                <button
                                    className={styles.primaryBtn}
                                    onClick={handleSubmitDocs}
                                    disabled={
                                        !convention || !report || submitting
                                    }
                                >
                                    <SendIcon />{" "}
                                    {submitting
                                        ? "Envoi…"
                                        : "Soumettre les documents"}
                                </button>
                            </div>
                        </div>
                    )}

                    {isStudent && stage.status === "docs_submitted" && (
                        <p className={styles.pendingNote}>
                            Vos documents sont en attente de confirmation.
                        </p>
                    )}

                    {(stage.conventionUrl || stage.reportUrl) && (
                        <div className={styles.docLinks}>
                            {stage.conventionUrl && (
                                <a
                                    href={stage.conventionUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={styles.docLink}
                                >
                                    Convention de stage
                                </a>
                            )}
                            {stage.reportUrl && (
                                <a
                                    href={stage.reportUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={styles.docLink}
                                >
                                    Rapport de stage
                                </a>
                            )}
                        </div>
                    )}

                    {canConfirmDocs && (
                        <div className={styles.reviewForm}>
                            <textarea
                                className={styles.textarea}
                                rows={3}
                                placeholder="Commentaire (obligatoire pour refus)"
                                value={docsReviewComment}
                                onChange={(e) =>
                                    setDocsReviewComment(e.target.value)
                                }
                            />
                            <div className={styles.reviewActions}>
                                <button
                                    className={styles.rejectBtn}
                                    onClick={() =>
                                        handleConfirmDocs("docs_rejected")
                                    }
                                    disabled={
                                        reviewing || !docsReviewComment.trim()
                                    }
                                >
                                    <CloseIcon /> Refuser
                                </button>
                                <button
                                    className={styles.approveBtn}
                                    onClick={() =>
                                        handleConfirmDocs("completed")
                                    }
                                    disabled={reviewing}
                                >
                                    <CheckIcon /> Confirmer
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ─── Comments ───────────────────────────────────────────────────── */}
            <div className={styles.commentsSection}>
                <h3 className={styles.commentsTitle}>
                    Commentaires ({comments.length})
                </h3>
                <div className={styles.commentsList}>
                    {comments.length === 0 && (
                        <p className={styles.nd}>Aucun commentaire.</p>
                    )}
                    {comments.map((c) => (
                        <div key={c.id} className={styles.comment}>
                            <div className={styles.commentHeader}>
                                <strong className={styles.commentAuthor}>
                                    {c.author?.name ?? "?"}
                                </strong>
                                <span className={styles.commentDate}>
                                    {fmtDate(c.createdAt)}
                                </span>
                                {isAdmin && (
                                    <button
                                        className={styles.deleteCommentBtn}
                                        onClick={() =>
                                            handleDeleteComment(c.id)
                                        }
                                        title="Supprimer"
                                    >
                                        <DeleteIcon />
                                    </button>
                                )}
                            </div>
                            <p className={styles.commentContent}>{c.content}</p>
                        </div>
                    ))}
                </div>
                <div className={styles.commentForm}>
                    <textarea
                        className={styles.textarea}
                        rows={3}
                        placeholder="Ajouter un commentaire…"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button
                        className={styles.primaryBtn}
                        onClick={handleAddComment}
                        disabled={!newComment.trim() || commenting}
                    >
                        {commenting ? "Envoi…" : "Commenter"}
                    </button>
                </div>
            </div>
        </section>
    );
}
