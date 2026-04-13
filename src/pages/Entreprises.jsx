import { useState, useMemo, useEffect } from "react";
import { DOMAIN_CONFIG } from "@/data/mock";
import { getCompanies, createCompany, deleteCompany } from "@/api/companies";
import SearchBar from "@/components/ui/SearchBar/SearchBar";
import ActionButton from "@/components/ui/ActionButton/ActionButton";
import Toolbar from "@/components/layout/Toolbar/Toolbar";
import DataTable from "@/components/dataTable/DataTable";
import Tag from "@/components/ui/Tag/Tag";
import EntrepriseSheet from "@/components/sheets/EntrepriseSheet";
import CreateEntrepriseModal from "./CreateEntrepriseModal";
import DeleteConfirm from "@/components/ui/DeleteConfirm/DeleteConfirm";
import FilterModal from "./FilterModal";

import SortIcon from "@mui/icons-material/ImportExport";
import FilterIcon from "@mui/icons-material/FilterList";
import PlusIcon from "@mui/icons-material/Add";
import DevicesIcon from "@mui/icons-material/Devices";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import StoreIcon from "@mui/icons-material/Storefront";
import FactoryIcon from "@mui/icons-material/Factory";
import DomainIcon from "@mui/icons-material/Domain";

const DOMAIN_ICONS = {
    Informatique: DevicesIcon,
    Agriculture: AgricultureIcon,
    Commerce: StoreIcon,
    Industrie: FactoryIcon,
};

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
];

export default function Entreprises() {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [showCreate, setShowCreate] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [sortKey, setSortKey] = useState(null);
    const [sortDir, setSortDir] = useState("asc");
    const [showFilter, setShowFilter] = useState(false);
    const [filters, setFilters] = useState({});

    useEffect(() => {
        getCompanies()
            .then(setCompanies)
            .finally(() => setLoading(false));
    }, []);

    async function handleCreate(form) {
        const created = await createCompany({
            id:          form.id || form.name.toLowerCase().replace(/\s+/g, "-"),
            name:        form.name,
            description: form.description,
        });
        setCompanies((prev) => [created, ...prev]);
    }

    async function handleDelete() {
        if (!deleteTarget) return;
        await deleteCompany(deleteTarget.id);
        setCompanies((prev) => prev.filter((c) => c.id !== deleteTarget.id));
        setDeleteTarget(null);
    }

    function handleSort(key) {
        if (sortKey === key) {
            setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        } else {
            setSortKey(key);
            setSortDir("asc");
        }
    }

    const displayed = useMemo(() => {
        let list = [...companies];

        if (filters.domain?.length) {
            list = list.filter((c) => filters.domain.includes(c.domain));
        }
        if (filters.province?.length) {
            list = list.filter((c) => filters.province.includes(c.province));
        }

        if (sortKey) {
            list.sort((a, b) => {
                const aVal = a[sortKey] ?? "";
                const bVal = b[sortKey] ?? "";
                const cmp = String(aVal).localeCompare(String(bVal), "fr");
                return sortDir === "asc" ? cmp : -cmp;
            });
        }

        return list;
    }, [companies, sortKey, sortDir, filters]);

    const activeFilterCount = Object.values(filters).flat().length;

    return (
        <>
            <section>
                <div className="sectionHeader">
                    <h2>Liste des entreprises</h2>
                    <p>Gérez les entreprises partenaires et leurs offres de stage.</p>
                </div>
                <Toolbar
                    searchBar={<SearchBar placeholder="Rechercher une entreprise..." />}
                    sortButton={
                        <ActionButton icon={SortIcon}>
                            {sortKey ? `Trié par ${sortKey}` : "Les plus récents"}
                        </ActionButton>
                    }
                    filterButton={
                        <ActionButton icon={FilterIcon} onClick={() => setShowFilter(true)}>
                            Filtres{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
                        </ActionButton>
                    }
                    createButton={
                        <ActionButton icon={PlusIcon} filled onClick={() => setShowCreate(true)}>
                            Ajouter une entreprise
                        </ActionButton>
                    }
                />
                <DataTable>
                    <DataTable.Header sortKey={sortKey} sortDir={sortDir} onSort={handleSort}>
                        <DataTable.Row>
                            <DataTable.SortableCell column="name">Entreprise</DataTable.SortableCell>
                            <DataTable.SortableCell column="domain">Domaine</DataTable.SortableCell>
                            <DataTable.SortableCell column="province">Province</DataTable.SortableCell>
                            <DataTable.Cell>Contact</DataTable.Cell>
                            <DataTable.Cell end>Actions</DataTable.Cell>
                        </DataTable.Row>
                    </DataTable.Header>
                    <DataTable.Body loading={loading}>
                        {displayed.map((company) => {
                            const domainCfg = DOMAIN_CONFIG[company.domain];
                            const DomainIconComp = DOMAIN_ICONS[company.domain] ?? DomainIcon;
                            return (
                                <DataTable.Row key={company.id}>
                                    <DataTable.Cell>{company.name}</DataTable.Cell>
                                    <DataTable.Cell muted={!company.domain}>
                                        {company.domain ? (
                                            <Tag
                                                icon={DomainIconComp}
                                                color={domainCfg?.color}
                                                background={domainCfg?.background}
                                            >
                                                {company.domain}
                                            </Tag>
                                        ) : "—"}
                                    </DataTable.Cell>
                                    <DataTable.Cell muted>{company.province ?? "—"}</DataTable.Cell>
                                    <DataTable.Cell muted>{company.contact?.name ?? "—"}</DataTable.Cell>
                                    <DataTable.Actions
                                        onView={() => setSelectedCompany(company)}
                                        onDelete={() => setDeleteTarget(company)}
                                    />
                                </DataTable.Row>
                            );
                        })}
                    </DataTable.Body>
                </DataTable>
            </section>

            <EntrepriseSheet company={selectedCompany} onClose={() => setSelectedCompany(null)} />
            <CreateEntrepriseModal isOpen={showCreate} onClose={() => setShowCreate(false)} onSave={handleCreate} />
            <FilterModal
                isOpen={showFilter}
                onClose={() => setShowFilter(false)}
                config={FILTER_CONFIG}
                values={filters}
                onChange={setFilters}
            />
            <DeleteConfirm
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                message={`Supprimer l'entreprise "${deleteTarget?.name}" ?`}
            />
        </>
    );
}
