import styles from "./LoadMore.module.scss";

export default function LoadMore({ hasMore, loading, onLoadMore, count, total }) {
    if (!hasMore) return null;
    return (
        <div className={styles.root}>
            <span className={styles.count}>{count} / {total} affiché{count > 1 ? "s" : ""}</span>
            <button className={styles.btn} onClick={onLoadMore} disabled={loading}>
                {loading ? "Chargement…" : "Voir plus"}
            </button>
        </div>
    );
}
