import { useState } from "react";
import { companies } from "@/data/mock";
import { useSaved } from "@/contexts/SavedContext";
import styles from "./Recherche.module.scss";

import SearchBar from "@/components/ui/SearchBar/SearchBar";
import Toolbar from "@/components/layout/Toolbar/Toolbar";
import ActionButton from "@/components/ui/ActionButton/ActionButton";
import CompanyCard from "@/components/company/CompanyCard/CompanyCard";
import EntrepriseSheet from "@/components/sheets/EntrepriseSheet";
import FilterModal from "./FilterModal";

import SortIcon from "@mui/icons-material/ImportExport";
import FilterIcon from "@mui/icons-material/FilterList";

const FILTER_CONFIG = [
    {
        key: "domain",
        label: "Domaine",
        options: [
            { value: "Informatique", label: "Informatique" },
            { value: "Agriculture", label: "Agriculture" },
            { value: "Commerce", label: "Commerce" },
            { value: "Industrie", label: "Industrie" },
        ],
    },
    {
        key: "province",
        label: "Province",
        options: [
            { value: "Liège", label: "Liège" },
            { value: "Namur", label: "Namur" },
            { value: "Hainaut", label: "Hainaut" },
        ],
    },
    {
        key: "offers",
        label: "Offres",
        options: [
            { value: "observation", label: "Stage d'observation" },
            { value: "bac3", label: "Stage BAC3" },
        ],
    },
];

export default function Recherche() {
    const { savedIds, toggleSaved } = useSaved();
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [showFilter, setShowFilter] = useState(false);
    const [filters, setFilters] = useState({});

    const activeFilterCount = Object.values(filters).flat().length;

    const displayed = companies.filter((c) => {
        if (filters.domain?.length && !filters.domain.includes(c.domain)) return false;
        if (filters.province?.length && !filters.province.includes(c.province)) return false;
        if (filters.offers?.length) {
            const wantsObs = filters.offers.includes("observation");
            const wantsBac3 = filters.offers.includes("bac3");
            if (wantsObs && !c.offresObservation) return false;
            if (wantsBac3 && !c.offres3e) return false;
        }
        return true;
    });

    return (
        <>
            <section>
                <div className="sectionHeader">
                    <h2>Rechercher un stage</h2>
                    <p>Explorez et trouvez le stage qui vous convient le mieux.</p>
                </div>
                <Toolbar
                    searchBar={<SearchBar placeholder="Rechercher une entreprise..." />}
                    sortButton={<ActionButton icon={SortIcon}>Les plus consultés</ActionButton>}
                    filterButton={
                        <ActionButton icon={FilterIcon} onClick={() => setShowFilter(true)}>
                            Filtres{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
                        </ActionButton>
                    }
                />
                <div className={styles.companyList}>
                    {displayed.map((company) => (
                        <CompanyCard
                            key={company.id}
                            company={company}
                            onLearnMore={() => setSelectedCompany(company)}
                            isSaved={savedIds.has(company.id)}
                            onToggleSave={() => toggleSaved(company.id)}
                        />
                    ))}
                </div>
            </section>

            <EntrepriseSheet company={selectedCompany} onClose={() => setSelectedCompany(null)} />
            <FilterModal
                isOpen={showFilter}
                onClose={() => setShowFilter(false)}
                config={FILTER_CONFIG}
                values={filters}
                onChange={setFilters}
            />
        </>
    );
}
