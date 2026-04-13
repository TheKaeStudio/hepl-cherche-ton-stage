import styles from "./InfoGrid.module.scss";

function InfoGrid({ children, columns = 3 }) {
    return (
        <dl className={styles.grid} style={{ "--cols": columns }}>
            {children}
        </dl>
    );
}

function Item({ label, children }) {
    return (
        <div className={styles.item}>
            <dt>{label}</dt>
            <dd>{children}</dd>
        </div>
    );
}

InfoGrid.Item = Item;

export default InfoGrid;
