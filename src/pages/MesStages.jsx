import { useState, useEffect } from "react";
import { getInternships } from "@/api/internships";
import StageCard from "@/components/ui/StageCard/StageCard";
import styles from "./MesStages.module.scss";

export default function MesStages() {
    const [stages, setStages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getInternships().then(setStages).finally(() => setLoading(false));
    }, []);

    return (
        <section>
            <div className="sectionHeader">
                <h2>Mon stage</h2>
                <p>Consultez vos stages et gérez votre dossier.</p>
            </div>
            <div className={styles.list}>
                {loading ? (
                    <p>Chargement…</p>
                ) : stages.length === 0 ? (
                    <p>Aucun stage enregistré.</p>
                ) : (
                    stages.map((stage) => (
                        <StageCard key={stage.id} stage={stage} />
                    ))
                )}
            </div>
        </section>
    );
}
