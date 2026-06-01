import { useState, useEffect, useMemo } from "react";
import { getCompanies } from "@/api/companies";
import { useSaved } from "@/contexts/SavedContext";
import { useDebounce } from "@/hooks/useDebounce";
import styles from "./Recherche.module.scss";

import SearchBar from "@/components/ui/SearchBar/SearchBar";
import Toolbar from "@/components/layout/Toolbar/Toolbar";
import ActionButton from "@/components/ui/ActionButton/ActionButton";
import CompanyCard from "@/components/company/CompanyCard/CompanyCard";
import CompanySheet from "@/components/sheets/CompanySheet";
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
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [showFilter, setShowFilter] = useState(false);
    const [filters, setFilters] = useState({});
    const [sortIdx, setSortIdx] = useState(0);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        setLoading(true);
        getCompanies({ search: debouncedSearch || undefined })
            .then(setCompanies)
            .finally(() => setLoading(false));
    }, [debouncedSearch]);

    function cycleSort() {
        setSortIdx((i) => (i + 1) % SORT_OPTIONS.length);
    }

    const activeFilterCount = Object.values(filters).flat().length;
    const currentSort = SORT_OPTIONS[sortIdx];

    const FILTER_CONFIG = useMemo(() => {
        const provinces  = [...new Set(companies.map((c) => c.province).filter(Boolean))].sort();
        const allDomains = [...new Set(companies.flatMap((c) => c.domains ?? []).filter(Boolean))].sort();
        const allTags    = [...new Set(companies.flatMap((c) => c.tags    ?? []).filter(Boolean))].sort();
        return [
            {
                key: "domain",
                label: "Domaine",
                options: allDomains.map((d) => ({ value: d, label: d })),
            },
            {
                key: "tag",
                label: "Secteur",
                options: allTags.map((t) => ({ value: t, label: t })),
            },
            {
                key: "province",
                label: "Province",
                options: provinces.map((p) => ({ value: p, label: p })),
            },
        ];
    }, [companies]);

    const displayed = useMemo(() => {
        let list = companies.filter((c) => {
            if (filters.domain?.length   && !filters.domain.some((d) => (c.domains ?? []).includes(d))) return false;
            if (filters.tag?.length      && !filters.tag.some((t)    => (c.tags    ?? []).includes(t))) return false;
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
                    searchBar={<SearchBar placeholder="Rechercher une entreprise..." value={search} onChange={setSearch} />}
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
                    <p className={styles.statusText}>Chargement…</p>
                ) : displayed.length === 0 ? (
                    <p className={styles.statusText}>Aucune entreprise trouvée.</p>
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

            <CompanySheet company={selectedCompany} onClose={() => setSelectedCompany(null)} />
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
