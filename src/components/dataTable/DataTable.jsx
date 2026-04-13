import styles from "./DataTable.module.scss";

import Header from "./DataTable.Header";
import Body from "./DataTable.Body";
import Row from "./DataTable.Row";
import Cell from "./DataTable.Cell";
import Actions from "./DataTable.Actions";
import UserCell from "./DataTable.UserCell";
import SortableCell from "./DataTable.SortableCell";

function DataTable({ children }) {
    return (
        <div className={styles.wrapper}>
            <div className={styles.scroll}>
                <table className={styles.table}>{children}</table>
            </div>
        </div>
    );
}

DataTable.Header = Header;
DataTable.Body = Body;
DataTable.Row = Row;
DataTable.Cell = Cell;
DataTable.Actions = Actions;
DataTable.UserCell = UserCell;
DataTable.SortableCell = SortableCell;

export default DataTable;
