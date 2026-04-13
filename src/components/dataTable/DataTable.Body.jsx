export default function Body({ children, loading }) {
    if (loading) {
        return (
            <tbody>
                <tr>
                    <td colSpan={99} style={{ padding: "32px", textAlign: "center", color: "var(--text)", fontSize: "14px" }}>
                        Chargement…
                    </td>
                </tr>
            </tbody>
        );
    }
    return <tbody>{children}</tbody>;
}
