import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getComments, addComment } from "@/api/internships";
import RightSheet from "@/components/ui/RightSheet/RightSheet";
import InfoGrid from "@/components/ui/InfoGrid/InfoGrid";
import Tag from "@/components/ui/Tag/Tag";
import Avatar from "@/components/ui/Avatar/Avatar";
import styles from "./StageSheet.module.scss";
import EmailIcon from "@mui/icons-material/EmailOutlined";
import PhoneIcon from "@mui/icons-material/PhoneOutlined";
import SendIcon from "@mui/icons-material/SendOutlined";

export default function StageSheet({ stage, onClose }) {
    const { user: currentUser } = useAuth();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [sending, setSending] = useState(false);

    useEffect(() => {
        if (!stage?.id) { setComments([]); return; }
        getComments(stage.id).then(setComments).catch(() => setComments([]));
    }, [stage?.id]);

    async function handleSendComment(e) {
        e.preventDefault();
        const text = newComment.trim();
        if (!text) return;
        setSending(true);
        try {
            const created = await addComment(stage.id, text);
            setComments((prev) => [...prev, created]);
            setNewComment("");
        } finally {
            setSending(false);
        }
    }

    const canComment = currentUser?.role === "manager" || currentUser?.role === "admin";

    return (
        <RightSheet isOpen={!!stage} onClose={onClose} title="Détails du stage">
            {stage && (
                <>
                    <div className={styles.titleSection}>
                        <ul><Tag status={stage.status} /></ul>
                        <h2 className={styles.title}>{stage.title}</h2>
                    </div>

                    <InfoGrid columns={2}>
                        <InfoGrid.Item label="Étudiant">{stage.student?.name ?? "—"}</InfoGrid.Item>
                        <InfoGrid.Item label="Groupe">{stage.group ?? "—"}</InfoGrid.Item>
                        <InfoGrid.Item label="Entreprise">{stage.company?.name ?? "—"}</InfoGrid.Item>
                        <InfoGrid.Item label="Responsable">{stage.supervisor ?? "—"}</InfoGrid.Item>
                        <InfoGrid.Item label="Début">
                            {stage.startDate
                                ? new Date(stage.startDate).toLocaleDateString("fr-BE", { day: "numeric", month: "long", year: "numeric" })
                                : "—"}
                        </InfoGrid.Item>
                        <InfoGrid.Item label="Fin">
                            {stage.endDate
                                ? new Date(stage.endDate).toLocaleDateString("fr-BE", { day: "numeric", month: "long", year: "numeric" })
                                : "—"}
                        </InfoGrid.Item>
                    </InfoGrid>

                    {stage.company?.contact && (
                        <div className={styles.contactSection}>
                            <p className={styles.sectionLabel}>Contact entreprise</p>
                            {stage.company.contact.email && (
                                <a href={`mailto:${stage.company.contact.email}`} className={styles.contactLink}>
                                    <EmailIcon />
                                    {stage.company.contact.email}
                                </a>
                            )}
                            {stage.company.contact.phone && (
                                <a href={`tel:${stage.company.contact.phone}`} className={styles.contactLink}>
                                    <PhoneIcon />
                                    {stage.company.contact.phone}
                                </a>
                            )}
                        </div>
                    )}

                    <div className={styles.commentsSection}>
                        <p className={styles.sectionLabel}>Commentaires ({comments.length})</p>
                        {comments.length === 0 ? (
                            <p className={styles.emptyComments}>Aucun commentaire.</p>
                        ) : (
                            <div className={styles.commentList}>
                                {comments.map((c) => (
                                    <div key={c.id} className={styles.comment}>
                                        <Avatar name={c.author?.name} size="sm" />
                                        <div className={styles.commentBody}>
                                            <div className={styles.commentMeta}>
                                                <span className={styles.commentAuthor}>{c.author?.name ?? "—"}</span>
                                                <span className={styles.commentDate}>
                                                    {new Date(c.createdAt).toLocaleDateString("fr-BE", { day: "numeric", month: "short", year: "numeric" })}
                                                </span>
                                            </div>
                                            <p className={styles.commentContent}>{c.content}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {canComment && (
                            <form className={styles.commentForm} onSubmit={handleSendComment}>
                                <textarea
                                    className={styles.commentInput}
                                    placeholder="Ajouter un commentaire…"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    rows={2}
                                />
                                <button
                                    className={styles.commentSendBtn}
                                    type="submit"
                                    disabled={sending || !newComment.trim()}
                                >
                                    <SendIcon fontSize="small" />
                                </button>
                            </form>
                        )}
                    </div>
                </>
            )}
        </RightSheet>
    );
}
