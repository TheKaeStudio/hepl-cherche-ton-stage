import styles from "./DataTable.module.scss";

export default function Body({ children, loading }) {
    if (loading) {
        return (
            <tbody>
                <tr>
                    <td colSpan={99} className={styles.loadingCell}>
                        Chargement…
                    </td>
                </tr>
            </tbody>
        );
    }
    return <tbody>{children}</tbody>;
}
