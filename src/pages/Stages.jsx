import { useState, useMemo } from "react";
import { stages } from "@/data/mock";
import SearchBar from "@/components/ui/SearchBar/SearchBar";
import ActionButton from "@/components/ui/ActionButton/ActionButton";
import Toolbar from "@/components/layout/Toolbar/Toolbar";
import DataTable from "@/components/dataTable/DataTable";
import Tag from "@/components/ui/Tag/Tag";
import StageSheet from "@/components/sheets/StageSheet";
import DeleteConfirm from "@/components/ui/DeleteConfirm/DeleteConfirm";
import FilterModal from "./FilterModal";
import CreateStageModal from "./CreateStageModal";

import SortIcon from "@mui/icons-material/ImportExport";
import FilterIcon from "@mui/icons-material/FilterList";
import PlusIcon from "@mui/icons-material/Add";

const FILTER_CONFIG = [
    {
        key: "status",
        label: "Statut",
        options: [
            { value: "en-cours", label: "En cours" },
            { value: "termine", label: "Terminé" },
            { value: "non-rempli", label: "Non rempli" },
        ],
    },
    {
        key: "group",
        label: "Groupe",
        options: [
            { value: "D301", label: "D301" },
            { value: "D202", label: "D202" },
        ],
    },
];

export default function Stages() {
    const [selectedStage, setSelectedStage] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [showCreate, setShowCreate] = useState(false);
    const [sortKey, setSortKey] = useState(null);
    const [sortDir, setSortDir] = useState("asc");
    const [showFilter, setShowFilter] = useState(false);
    const [filters, setFilters] = useState({});

    function handleSort(key) {
        if (sortKey === key) {
            setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        } else {
            setSortKey(key);
            setSortDir("asc");
        }
    }

    const displayed = useMemo(() => {
        let list = [...stages];

        // Filter
        if (filters.status?.length) {
            list = list.filter((s) => filters.status.includes(s.status));
        }
        if (filters.group?.length) {
            list = list.filter((s) => filters.group.includes(s.group));
        }

        // Sort
        if (sortKey) {
            list.sort((a, b) => {
                let aVal = sortKey === "student" ? a.student.name
                         : sortKey === "company" ? a.company.name
                         : a[sortKey] ?? "";
                let bVal = sortKey === "student" ? b.student.name
                         : sortKey === "company" ? b.company.name
                         : b[sortKey] ?? "";
                const cmp = String(aVal).localeCompare(String(bVal), "fr");
                return sortDir === "asc" ? cmp : -cmp;
            });
        }

        return list;
    }, [stages, sortKey, sortDir, filters]);

    const activeFilterCount = Object.values(filters).flat().length;

    return (
        <>
            <section>
                <div className="sectionHeader">
                    <h2>Liste des stages</h2>
                    <p>Gérez et suivez tous les stages de l'établissement.</p>
                </div>
                <Toolbar
                    searchBar={<SearchBar placeholder="Rechercher un stage..." />}
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
                    createButton={<ActionButton icon={PlusIcon} filled>Ajouter un stage</ActionButton>}
                />
                <DataTable>
                    <DataTable.Header sortKey={sortKey} sortDir={sortDir} onSort={handleSort}>
                        <DataTable.Row>
                            <DataTable.SortableCell column="student">Étudiant</DataTable.SortableCell>
                            <DataTable.SortableCell column="title">Titre</DataTable.SortableCell>
                            <DataTable.SortableCell column="company">Entreprise</DataTable.SortableCell>
                            <DataTable.Cell>Groupe</DataTable.Cell>
                            <DataTable.Cell>Durée</DataTable.Cell>
                            <DataTable.SortableCell column="status">Statut</DataTable.SortableCell>
                            <DataTable.Cell end>Actions</DataTable.Cell>
                        </DataTable.Row>
                    </DataTable.Header>
                    <DataTable.Body>
                        {displayed.map((stage) => (
                            <DataTable.Row key={stage.id}>
                                <DataTable.UserCell user={stage.student}>
                                    {stage.student.name}
                                </DataTable.UserCell>
                                <DataTable.Cell>{stage.title}</DataTable.Cell>
                                <DataTable.Cell truncate>{stage.company.name}</DataTable.Cell>
                                <DataTable.Cell muted>{stage.group}</DataTable.Cell>
                                <DataTable.Cell muted>
                                    {new Date(stage.startDate).toLocaleDateString("fr-BE", {
                                        day: "numeric",
                                        month: "short",
                                    })}
                                    {" → "}
                                    {new Date(stage.endDate).toLocaleDateString("fr-BE", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </DataTable.Cell>
                                <DataTable.Cell>
                                    <Tag status={stage.status} />
                                </DataTable.Cell>
                                <DataTable.Actions
                                    onView={() => setSelectedStage(stage)}
                                    onDelete={() => setDeleteTarget(stage)}
                                />
                            </DataTable.Row>
                        ))}
                    </DataTable.Body>
                </DataTable>
            </section>

            <StageSheet stage={selectedStage} onClose={() => setSelectedStage(null)} />
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
                onConfirm={() => setDeleteTarget(null)}
                message={`Supprimer le stage "${deleteTarget?.title}" ?`}
            />
        </>
    );
}
