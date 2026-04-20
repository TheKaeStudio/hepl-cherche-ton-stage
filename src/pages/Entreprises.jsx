import { useState, useMemo, useEffect } from "react";
import { DOMAIN_CONFIG } from "@/data/mock";
import { getCompanies, createCompany, deleteCompany, giveAccess } from "@/api/companies";
import Modal from "@/components/ui/Modal/Modal";
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
    const [accessLink, setAccessLink] = useState(null);
    const [sortKey, setSortKey] = useState(null);
    const [sortDir, setSortDir] = useState("asc");
    const [showFilter, setShowFilter] = useState(false);
    const [filters, setFilters] = useState({});

    useEffect(() => {
        getCompanies()
            .then(setCompanies)
            .finally(() => setLoading(false));
    }, []);

    async function handleCreate(payload) {
        const created = await createCompany(payload);
        setCompanies((prev) => [created, ...prev]);
    }

    async function handleDelete() {
        const target = deleteTarget;
        if (!target) return;
        setDeleteTarget(null);
        await deleteCompany(target.id).catch(() => {});
        setCompanies((prev) => prev.filter((c) => c.id !== target.id));
    }

    async function handleGiveAccess(company) {
        try {
            const result = await giveAccess(company.id);
            const key = result?.key;
            const link = key
                ? `${window.location.origin}/company/acces?key=${key}`
                : null;
            setAccessLink({ company, link });
        } catch {
            setAccessLink({ company, link: null, error: true });
        }
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
                                        onGiveAccess={() => handleGiveAccess(company)}
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
            <Modal
                isOpen={!!accessLink}
                onClose={() => setAccessLink(null)}
                title={`Accès — ${accessLink?.company?.name ?? ""}`}
                size="sm"
            >
                {accessLink?.error ? (
                    <p style={{ color: "#ef4444", fontSize: "14px" }}>
                        Erreur lors de la génération du lien.
                    </p>
                ) : accessLink?.link ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <p style={{ fontSize: "13px", color: "var(--text)" }}>
                            Partagez ce lien avec l'entreprise pour qu'elle puisse modifier sa fiche :
                        </p>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                            <input
                                readOnly
                                value={accessLink.link}
                                style={{
                                    flex: 1, padding: "10px 12px", borderRadius: "10px",
                                    border: "2px solid var(--border)", background: "var(--bg-alt)",
                                    fontSize: "13px", color: "var(--text-h)", fontFamily: "monospace",
                                }}
                            />
                            <button
                                onClick={() => navigator.clipboard.writeText(accessLink.link)}
                                style={{
                                    padding: "10px 16px", borderRadius: "10px", border: "2px solid var(--border)",
                                    background: "var(--bg)", cursor: "pointer", fontSize: "13px", fontWeight: 700,
                                    color: "var(--text-h)", fontFamily: "var(--sans)",
                                }}
                            >
                                Copier
                            </button>
                        </div>
                    </div>
                ) : (
                    <p style={{ fontSize: "14px", color: "var(--text)" }}>
                        Lien généré, mais format inconnu. Vérifiez la réponse API.
                    </p>
                )}
            </Modal>
        </>
    );
}
