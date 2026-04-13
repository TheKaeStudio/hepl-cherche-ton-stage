import { useTableContext } from "./DataTable.context";
import styles from "./DataTable.Cell.module.scss";

export default function Cell({ children, muted, image, truncate, end }) {
    const { isHeader } = useTableContext();
    const Tag = isHeader ? "th" : "td";

    const className = [
        muted ? styles.muted : "",
        truncate ? styles.truncate : "",
        end ? styles.end : "",
    ]
        .filter(Boolean)
        .join(" ");

    const needsWrapper = image || truncate;

    return (
        <Tag className={className || undefined}>
            {needsWrapper ? (
                <div className={styles.content}>
                    {image && <img src={image} className={styles.image} alt="" />}
                    <span className={truncate ? styles.text : undefined}>
                        {children}
                    </span>
                </div>
            ) : (
                children
            )}
        </Tag>
    );
}
