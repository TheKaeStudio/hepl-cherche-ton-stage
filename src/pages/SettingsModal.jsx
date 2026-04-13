import { useNavigate } from "react-router-dom";

export default function SettingsModal() {
    const navigate = useNavigate();

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0, 0, 0, 0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 100,
            }}
            onClick={() => navigate(-1)}
        >
            <div onClick={(e) => e.stopPropagation()}>
                <h2>Paramètres</h2>
            </div>
        </div>
    );
}
