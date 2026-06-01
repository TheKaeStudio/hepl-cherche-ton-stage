import { useState, useEffect, useMemo } from "react";
import { getCompanies } from "@/api/companies";
import { useSaved } from "@/contexts/SavedContext";
import CompanyCard from "@/components/company/CompanyCard/CompanyCard";
import CompanySheet from "@/components/sheets/CompanySheet";
import styles from "./Saved.module.scss";

export default function Saved() {
    const { savedIds, toggleSaved } = useSaved();
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCompany, setSelectedCompany] = useState(null);

    useEffect(() => {
        getCompanies()
            .then(setCompanies)
            .finally(() => setLoading(false));
    }, []);

    const savedCompanies = useMemo(
        () => companies.filter((c) => savedIds.has(c.id)),
        [companies, savedIds]
    );

    return (
        <>
            <section>
                <div className="sectionHeader">
                    <h2>Entreprises enregistrées</h2>
                    <p>Les entreprises que vous avez mises de côté.</p>
                </div>
                {!loading && savedCompanies.length === 0 ? (
                    <p>Aucune entreprise enregistrée.</p>
                ) : (
                    <div className={styles.list}>
                        {savedCompanies.map((company) => (
                            <CompanyCard
                                key={company.id}
                                company={company}
                                onLearnMore={() => setSelectedCompany(company)}
                                isSaved
                                onToggleSave={() => toggleSaved(company.id)}
                            />
                        ))}
                    </div>
                )}
            </section>

            <CompanySheet company={selectedCompany} onClose={() => setSelectedCompany(null)} />
        </>
    );
}
