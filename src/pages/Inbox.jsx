import { useState } from "react";
import { messages, formatDate } from "@/data/mock";
import Avatar from "@/components/ui/Avatar/Avatar";
import Modal from "@/components/ui/Modal/Modal";
import ActionButton from "@/components/ui/ActionButton/ActionButton";
import styles from "./Inbox.module.scss";

import SendIcon from "@mui/icons-material/Send";

export default function Inbox() {
    const [readIds, setReadIds] = useState(
        () => new Set(messages.filter((m) => m.read).map((m) => m.id))
    );
    const [selectedMsg, setSelectedMsg] = useState(null);
    const [reply, setReply] = useState("");

    function openMessage(msg) {
        setSelectedMsg(msg);
        setReadIds((prev) => new Set([...prev, msg.id]));
        setReply("");
    }

    function closeMessage() {
        setSelectedMsg(null);
        setReply("");
    }

    function handleSend() {
        if (!reply.trim()) return;
        setReply("");
    }

    const unreadCount = messages.filter((m) => !readIds.has(m.id)).length;

    return (
        <>
            <section>
                <div className="sectionHeader">
                    <h2>Boîte de réception</h2>
                    <p>{unreadCount > 0 ? `${unreadCount} message(s) non lu(s).` : "Aucun message non lu."}</p>
                </div>
                <ul className={styles.list}>
                    {messages.map((msg) => {
                        const isUnread = !readIds.has(msg.id);
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
