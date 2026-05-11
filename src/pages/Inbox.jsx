import { useState } from "react";
import { getMessages, markMessageRead, sendMessage } from "@/api/messages";
import { usePaginatedList } from "@/hooks/usePaginatedList";
import { formatDate } from "@/data/mock";
import Avatar from "@/components/ui/Avatar/Avatar";
import Modal from "@/components/ui/Modal/Modal";
import ActionButton from "@/components/ui/ActionButton/ActionButton";
import LoadMore from "@/components/ui/LoadMore/LoadMore";
import styles from "./Inbox.module.scss";

import SendIcon from "@mui/icons-material/Send";

export default function Inbox() {
    const { items: messages, loading, loadingMore, hasMore, total, loadMore, setItems: setMessages } =
        usePaginatedList((params) => getMessages(params), 20);

    const [selectedMsg, setSelectedMsg] = useState(null);
    const [reply,       setReply]       = useState("");

    function openMessage(msg) {
        setSelectedMsg(msg);
        setReply("");
        if (!msg.read) {
            markMessageRead(msg.id).catch(() => {});
            setMessages((prev) => prev.map((m) => m.id === msg.id ? { ...m, read: true } : m));
        }
    }

    function closeMessage() {
        setSelectedMsg(null);
        setReply("");
    }

    async function handleSend() {
        if (!reply.trim() || !selectedMsg) return;
        try {
            await sendMessage(selectedMsg.from.id, `Re: ${selectedMsg.subject}`, reply);
            setReply("");
        } catch { /* ignore */ }
    }

    const unreadCount = messages.filter((m) => !m.read).length;

    return (
        <>
            <section>
                <div className="sectionHeader">
                    <h2>Boîte de réception</h2>
                    <p>{unreadCount > 0 ? `${unreadCount} message(s) non lu(s).` : "Aucun message non lu."}</p>
                </div>
                {!loading && messages.length === 0 && (
                    <p className={styles.emptyText}>Aucun message.</p>
                )}
                {(loading || messages.length > 0) && (
                    <ul className={styles.list}>
                        {loading && <li className={styles.loadingItem}>Chargement…</li>}
                        {messages.map((msg) => {
                            const isUnread = !msg.read;
                            return (
                                <li
                                    key={msg.id}
                                    className={`${styles.item} ${isUnread ? styles.unread : ""}`}
                                    onClick={() => openMessage(msg)}
                                >
                                    <Avatar name={msg.from.name} size="md" />
                                    <div className={styles.content}>
                                        <div className={styles.top}>
                                            <span className={styles.sender}>{msg.from.name}</span>
                                            <span className={styles.date}>{formatDate(msg.date)}</span>
                                        </div>
                                        <p className={styles.subject}>{msg.subject}</p>
                                        <p className={styles.preview}>{msg.body.slice(0, 100)}…</p>
                                    </div>
                                    {isUnread && <div className={styles.dot} />}
                                </li>
                            );
                        })}
                    </ul>
                )}
                <LoadMore hasMore={hasMore} loading={loadingMore} onLoadMore={loadMore} count={messages.length} total={total} />
            </section>

            <Modal
                isOpen={!!selectedMsg}
                onClose={closeMessage}
                title={selectedMsg?.subject}
                size="md"
                footer={
                    <ActionButton icon={SendIcon} filled reversed onClick={handleSend}>
                        Répondre
                    </ActionButton>
                }
            >
                {selectedMsg && (
                    <>
                        <div className={styles.msgMeta}>
                            <Avatar name={selectedMsg.from.name} size="md" />
                            <div>
                                <p className={styles.msgSender}>{selectedMsg.from.name}</p>
                                <p className={styles.msgDate}>{formatDate(selectedMsg.date)}</p>
                            </div>
                        </div>
                        <p className={styles.msgBody}>{selectedMsg.body}</p>
                        <textarea
                            className={styles.replyArea}
                            placeholder="Répondre..."
                            value={reply}
                            onChange={(e) => setReply(e.target.value)}
                            rows={3}
                        />
                    </>
                )}
            </Modal>
        </>
    );
}
