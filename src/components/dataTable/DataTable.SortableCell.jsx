import { useTableContext } from "./DataTable.context";
import styles from "./DataTable.SortableCell.module.scss";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";

export default function SortableCell({ children, column }) {
    const { sortKey, sortDir, onSort } = useTableContext();
    const isActive = sortKey === column;

    return (
        <th
            className={`${styles.cell} ${isActive ? styles.active : ""}`}
            onClick={() => onSort?.(column)}
        >
            <div className={styles.content}>
                <span>{children}</span>
                <span className={styles.icon}>
                    {isActive ? (
                        sortDir === "asc" ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />
                    ) : (
                        <UnfoldMoreIcon />
                    )}
                </span>
            </div>
        </th>
    );
}
