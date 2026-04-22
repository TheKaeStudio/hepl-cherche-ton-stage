import { useState, useEffect, useMemo } from "react";
import { getCompanies } from "@/api/companies";
import { useSaved } from "@/contexts/SavedContext";
import { useSecteurs } from "@/contexts/SecteurContext";
import styles from "./Recherche.module.scss";

import SearchBar from "@/components/ui/SearchBar/SearchBar";
import Toolbar from "@/components/layout/Toolbar/Toolbar";
import ActionButton from "@/components/ui/ActionButton/ActionButton";
import CompanyCard from "@/components/company/CompanyCard/CompanyCard";
import EntrepriseSheet from "@/components/sheets/EntrepriseSheet";
import FilterModal from "./FilterModal";

import SortIcon from "@mui/icons-material/ImportExport";
import FilterIcon from "@mui/icons-material/FilterList";

const SORT_OPTIONS = [
    { key: null,        label: "Par défaut" },
    { key: "name_asc",  label: "Nom A → Z"  },
    { key: "name_desc", label: "Nom Z → A"  },
];

export default function Recherche() {
    const { savedIds, toggleSaved } = useSaved();
    const { sectors } = useSecteurs();
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [showFilter, setShowFilter] = useState(false);
    const [filters, setFilters] = useState({});
    const [sortIdx, setSortIdx] = useState(0);

    useEffect(() => {
        getCompanies().then(setCompanies).finally(() => setLoading(false));
    }, []);

    function cycleSort() {
        setSortIdx((i) => (i + 1) % SORT_OPTIONS.length);
    }

    const activeFilterCount = Object.values(filters).flat().length;
    const currentSort = SORT_OPTIONS[sortIdx];

    const FILTER_CONFIG = useMemo(() => {
        const provinces = [...new Set(companies.map((c) => c.province).filter(Boolean))].sort();
        return [
            {
                key: "domain",
                label: "Domaine",
                options: sectors.map((s) => ({ value: s.name, label: s.name })),
            },
            {
                key: "province",
                label: "Province",
                options: provinces.map((p) => ({ value: p, label: p })),
            },
        ];
    }, [companies, sectors]);

    const displayed = useMemo(() => {
        let list = companies.filter((c) => {
            if (filters.domain?.length   && !filters.domain.includes(c.domain))     return false;
            if (filters.province?.length && !filters.province.includes(c.province)) return false;
            return true;
        });

        if (currentSort.key === "name_asc") {
            list = [...list].sort((a, b) => a.name.localeCompare(b.name, "fr"));
        } else if (currentSort.key === "name_desc") {
            list = [...list].sort((a, b) => b.name.localeCompare(a.name, "fr"));
        }

        return list;
    }, [companies, filters, currentSort]);

    return (
        <>
            <section>
                <div className="sectionHeader">
                    <h2>Rechercher un stage</h2>
                    <p>Explorez et trouvez le stage qui vous convient le mieux.</p>
                </div>
                <Toolbar
                    searchBar={<SearchBar placeholder="Rechercher une entreprise..." />}
                    sortButton={
                        <ActionButton icon={SortIcon} onClick={cycleSort}>
                            {currentSort.label}
                        </ActionButton>
                    }
                    filterButton={
                        <ActionButton icon={FilterIcon} onClick={() => setShowFilter(true)}>
                            Filtres{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
                        </ActionButton>
                    }
                />
                {loading ? (
                    <p style={{ padding: "24px 0", color: "var(--text)", fontSize: "14px" }}>Chargement…</p>
                ) : displayed.length === 0 ? (
                    <p style={{ padding: "24px 0", color: "var(--text)", fontSize: "14px" }}>Aucune entreprise trouvée.</p>
                ) : (
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
                )}
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
