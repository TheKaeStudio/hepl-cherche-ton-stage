import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getCompanies, createCompany, deleteCompany, giveAccess } from "@/api/companies";
import { useSecteurs } from "@/contexts/SecteurContext";
import { useAuth } from "@/contexts/AuthContext";
import { usePaginatedList } from "@/hooks/usePaginatedList";
import SearchBar from "@/components/ui/SearchBar/SearchBar";
import ActionButton from "@/components/ui/ActionButton/ActionButton";
import DropdownActionMenu from "@/components/ui/DropdownActionMenu/DropdownActionMenu";
import Toolbar from "@/components/layout/Toolbar/Toolbar";
import DataTable from "@/components/dataTable/DataTable";
import Tag from "@/components/ui/Tag/Tag";
import LoadMore from "@/components/ui/LoadMore/LoadMore";
import EntrepriseSheet from "@/components/sheets/EntrepriseSheet";
import CreateEntrepriseModal from "./CreateEntrepriseModal";
import GestionSecteursModal from "./GestionSecteursModal";
import DeleteConfirm from "@/components/ui/DeleteConfirm/DeleteConfirm";
import FilterModal from "./FilterModal";
import Modal from "@/components/ui/Modal/Modal";

import SortIcon   from "@mui/icons-material/ImportExport";
import FilterIcon from "@mui/icons-material/FilterList";
import PlusIcon   from "@mui/icons-material/Add";

import styles from "./Entreprises.module.scss";

export default function Entreprises() {
    const navigate        = useNavigate();
    const { sectors }     = useSecteurs();
    const { user }        = useAuth();

    const { items: companies, loading, loadingMore, hasMore, total, loadMore, setItems: setCompanies } =
        usePaginatedList((params) => getCompanies(params), 20);

    const [selectedCompany, setSelectedCompany] = useState(null);
    const [showCreate,      setShowCreate]      = useState(false);
    const [showSecteurs,    setShowSecteurs]    = useState(false);
    const [deleteTarget,    setDeleteTarget]    = useState(null);
    const [accessTarget,    setAccessTarget]    = useState(null);
    const [linkCreating,    setLinkCreating]    = useState(false);
    const [linkError,       setLinkError]       = useState(false);
    const [sortKey,         setSortKey]         = useState(null);
    const [sortDir,         setSortDir]         = useState("asc");
    const [showFilter,      setShowFilter]      = useState(false);
    const [filters,         setFilters]         = useState({});

    async function handleCreate(payload) {
        const created = await createCompany(payload);
        setCompanies((prev) => [created, ...prev]);
        setShowCreate(false);
    }

    async function handleDelete() {
        const target = deleteTarget;
        if (!target) return;
        setDeleteTarget(null);
        await deleteCompany(target.id).catch(() => {});
        setCompanies((prev) => prev.filter((c) => c.id !== target.id));
    }

    function handleGiveAccess(company) {
        setLinkError(false);
        setAccessTarget(company);
    }

    async function handleCreateLink() {
        setLinkCreating(true);
        setLinkError(false);
        try {
            const result = await giveAccess(accessTarget.id);
            const key    = result?.key;
            if (key) {
                const invite = { key, createdAt: new Date().toISOString(), used: false };
                setAccessTarget((prev) => ({ ...prev, invite }));
                setCompanies((prev) => prev.map((c) => c.id === accessTarget.id ? { ...c, invite } : c));
            }
        } catch {
            setLinkError(true);
        } finally {
            setLinkCreating(false);
        }
    }

    function handleSort(key) {
        if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        else { setSortKey(key); setSortDir("asc"); }
    }

    const FILTER_CONFIG = useMemo(() => {
        const provinces = [...new Set(companies.map((c) => c.province).filter(Boolean))].sort();
        return [
            {
                key: "domain",
                label: "Secteur",
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
        let list = [...companies];
        if (filters.domain?.length)   list = list.filter((c) => filters.domain.includes(c.domain));
        if (filters.province?.length) list = list.filter((c) => filters.province.includes(c.province));
        if (sortKey) {
            list.sort((a, b) => {
                const cmp = String(a[sortKey] ?? "").localeCompare(String(b[sortKey] ?? ""), "fr");
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
                {user?.role !== "limited" && (
                    <Toolbar
                        searchBar={<SearchBar placeholder="Rechercher une entreprise…" />}
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
                            <DropdownActionMenu
                                icon={PlusIcon}
                                filled
                                items={[
                                    { label: "Ajouter une entreprise", onClick: () => setShowCreate(true) },
                                    { label: "Gérer les secteurs",     onClick: () => setShowSecteurs(true) },
                                ]}
                            />
                        }
                    />
                )}
                <DataTable>
                    <DataTable.Header sortKey={sortKey} sortDir={sortDir} onSort={handleSort}>
                        <DataTable.Row>
                            <DataTable.SortableCell column="name">Entreprise</DataTable.SortableCell>
                            <DataTable.SortableCell column="domain">Secteur</DataTable.SortableCell>
                            <DataTable.Cell>Lieu</DataTable.Cell>
                            <DataTable.Cell>Contact</DataTable.Cell>
                            <DataTable.Cell end>Actions</DataTable.Cell>
                        </DataTable.Row>
                    </DataTable.Header>
                    <DataTable.Body loading={loading}>
                        {displayed.map((company) => {
                            const sectorObj = company.sector ?? sectors.find((s) => s.name === company.domain) ?? null;
                            const lieu      = company.province ?? company.country ?? "—";
                            return (
                                <DataTable.Row key={company.id}>
                                    <DataTable.Cell>{company.name}</DataTable.Cell>
                                    <DataTable.Cell>
                                        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                            <Tag sector={sectorObj} />
                                        </ul>
                                    </DataTable.Cell>
                                    <DataTable.Cell muted>{lieu}</DataTable.Cell>
                                    <DataTable.Cell muted>{company.contact?.name ?? "—"}</DataTable.Cell>
                                    <DataTable.Actions
                                        onView={() => setSelectedCompany(company)}
                                        onEdit={() => navigate(`/entreprises/${company.id}/modifier`)}
                                        onGiveAccess={() => handleGiveAccess(company)}
                                        onDelete={() => setDeleteTarget(company)}
                                    />
                                </DataTable.Row>
                            );
                        })}
                    </DataTable.Body>
                </DataTable>
                <LoadMore hasMore={hasMore} loading={loadingMore} onLoadMore={loadMore} count={companies.length} total={total} />
            </section>

            <EntrepriseSheet company={selectedCompany} onClose={() => setSelectedCompany(null)} />
            <CreateEntrepriseModal isOpen={showCreate} onClose={() => setShowCreate(false)} onSave={handleCreate} />
            <GestionSecteursModal  isOpen={showSecteurs} onClose={() => setShowSecteurs(false)} />
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
                isOpen={!!accessTarget}
                onClose={() => { setAccessTarget(null); setLinkError(false); }}
                title={`Accès — ${accessTarget?.name ?? ""}`}
                size="sm"
            >
                {linkError && (
                    <p style={{ color: "#ef4444", fontSize: "14px", marginBottom: "12px" }}>
                        Erreur lors de la génération du lien.
                    </p>
                )}
                {accessTarget?.invite?.key ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <p style={{ fontSize: "13px", color: "var(--text)", margin: 0 }}>
                            Partagez ce lien avec l'entreprise pour qu'elle puisse modifier sa fiche :
                        </p>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                            <input
                                readOnly
                                value={`${window.location.origin}/company/acces?key=${accessTarget.invite.key}`}
                                style={{ flex: 1, padding: "10px 12px", borderRadius: "10px", border: "2px solid var(--border)", background: "var(--bg-alt, var(--bg))", fontSize: "13px", color: "var(--text-h)", fontFamily: "monospace" }}
                            />
                            <ActionButton onClick={() => navigator.clipboard.writeText(`${window.location.origin}/company/acces?key=${accessTarget.invite.key}`)}>
                                Copier
                            </ActionButton>
                        </div>
                        <ActionButton filled onClick={handleCreateLink} disabled={linkCreating}>
                            {linkCreating ? "Génération…" : "Recréer un lien"}
                        </ActionButton>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <p style={{ fontSize: "13px", color: "var(--text)", margin: 0 }}>
                            Aucun lien d'accès actif pour cette entreprise.
                        </p>
                        <ActionButton filled onClick={handleCreateLink} disabled={linkCreating}>
                            {linkCreating ? "Génération…" : "Créer un lien"}
                        </ActionButton>
                    </div>
                )}
            </Modal>
        </>
    );
}
