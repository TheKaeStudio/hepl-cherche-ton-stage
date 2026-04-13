import { useState } from "react";
import { companies } from "@/data/mock";
import { useSaved } from "@/contexts/SavedContext";
import SearchBar from "@/components/ui/SearchBar/SearchBar";
import ActionButton from "@/components/ui/ActionButton/ActionButton";
import Toolbar from "@/components/layout/Toolbar/Toolbar";
import CompanyCard from "@/components/company/CompanyCard/CompanyCard";
import EntrepriseSheet from "@/components/sheets/EntrepriseSheet";
import styles from "./Saved.module.scss";

import SortIcon from "@mui/icons-material/ImportExport";
import FilterIcon from "@mui/icons-material/FilterList";

export default function Saved() {
    const { savedIds, toggleSaved } = useSaved();
    const [selectedCompany, setSelectedCompany] = useState(null);
    const savedCompanies = companies.filter((c) => savedIds.has(c.id));

    return (
        <>
            <section>
                <div className="sectionHeader">
                    <h2>Entreprises enregistrées</h2>
                    <p>Les entreprises que vous avez mises de côté.</p>
                </div>
                <Toolbar
                    searchBar={<SearchBar placeholder="Rechercher..." />}
                    sortButton={<ActionButton icon={SortIcon}>Les plus consultés</ActionButton>}
                    filterButton={<ActionButton icon={FilterIcon}>Filtres</ActionButton>}
                />
                {savedCompanies.length === 0 ? (
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

            <EntrepriseSheet company={selectedCompany} onClose={() => setSelectedCompany(null)} />
        </>
    );
}
