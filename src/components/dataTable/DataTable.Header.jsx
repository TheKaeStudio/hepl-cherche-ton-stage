import { TableContext } from "./DataTable.context";
import styles from "./DataTable.Header.module.scss";

export default function Header({ children, sortKey, sortDir, onSort }) {
    return (
        <TableContext.Provider value={{ isHeader: true, sortKey, sortDir, onSort }}>
            <thead className={styles.header}>{children}</thead>
        </TableContext.Provider>
    );
}
