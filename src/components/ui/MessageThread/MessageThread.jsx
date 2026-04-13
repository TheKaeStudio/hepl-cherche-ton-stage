import styles from "./MessageThread.module.scss";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export default function MessageThread({ messages, currentUserId }) {
    return (
        <div className={styles.thread}>
            {messages.map((msg) => {
                const isMe = msg.from.id === currentUserId;
                const time = new Date(msg.date).toLocaleTimeString("fr-BE", {
                    hour: "2-digit",
                    minute: "2-digit",
                });
                const day = new Date(msg.date).toLocaleDateString("fr-BE", {
                    day: "numeric",
                    month: "short",
                });

                return (
                    <div key={msg.id} className={`${styles.message} ${isMe ? styles.mine : styles.theirs}`}>
                        {!isMe && (
                            <div className={styles.avatar}>
                                {msg.from.photo ? (
                                    <img src={msg.from.photo} alt={msg.from.name} />
                                ) : (
                                    <AccountCircleIcon className={styles.avatarIcon} />
                                )}
                            </div>
                        )}
                        <div className={styles.bubbleWrap}>
                            {!isMe && (
                                <span className={styles.sender}>{msg.from.name}</span>
                            )}
                            <div className={styles.bubble}>
                                <p>{msg.body}</p>
                            </div>
                            <span className={styles.time}>{day} · {time}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
