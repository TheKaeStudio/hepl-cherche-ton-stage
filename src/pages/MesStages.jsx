import { useState } from "react";
import { stages, currentUser } from "@/data/mock";
import StageCard from "@/components/ui/StageCard/StageCard";
import StageSheet from "@/components/sheets/StageSheet";
import styles from "./MesStages.module.scss";

export default function MesStages() {
    const myStages = stages.filter((s) => s.student.id === currentUser.id);
    const [selectedStage, setSelectedStage] = useState(null);

    return (
        <>
            <section>
                <div className="sectionHeader">
                    <h2>Mes stages</h2>
                    <p>Consultez et gérez vos stages en cours et passés.</p>
                </div>
                <div className={styles.list}>
                    {myStages.length === 0 ? (
                        <p>Aucun stage enregistré.</p>
                    ) : (
                        myStages.map((stage) => (
                            <StageCard
                                key={stage.id}
                                stage={stage}
                                onLearnMore={() => setSelectedStage(stage)}
                            />
                        ))
                    )}
                </div>
            </section>
            <StageSheet stage={selectedStage} onClose={() => setSelectedStage(null)} />
        </>
    );
}
