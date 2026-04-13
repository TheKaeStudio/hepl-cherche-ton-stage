import { useState, useMemo } from "react";
import { users } from "@/data/mock";
import SearchBar from "@/components/ui/SearchBar/SearchBar";
import ActionButton from "@/components/ui/ActionButton/ActionButton";
import Toolbar from "@/components/layout/Toolbar/Toolbar";
import DataTable from "@/components/dataTable/DataTable";
import Tag from "@/components/ui/Tag/Tag";
import SendMessageModal from "./SendMessageModal";
import DeleteConfirm from "@/components/ui/DeleteConfirm/DeleteConfirm";
import FilterModal from "./FilterModal";

import SortIcon from "@mui/icons-material/ImportExport";
import FilterIcon from "@mui/icons-material/FilterList";
import PlusIcon from "@mui/icons-material/Add";

const students = users.filter((u) => u.role === "etudiant");

const FILTER_CONFIG = [
    {
        key: "stageStatus",
        label: "Statut de stage",
        options: [
            { value: "en-cours", label: "En cours" },
            { value: "termine", label: "Terminé" },
            { value: "non-rempli", label: "Non rempli" },
        ],
    },
    {
        key: "class",
        label: "Groupe",
        options: [
            { value: "D301", label: "D301" },
            { value: "D202", label: "D202" },
        ],
    },
];

export default function Etudiants() {
    const [showMessage, setShowMessage] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
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
        let list = [...students];

        if (filters.stageStatus?.length) {
            list = list.filter((s) => filters.stageStatus.includes(s.stageStatus));
        }
        if (filters.class?.length) {
            list = list.filter((s) => filters.class.includes(s.class));
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
    }, [sortKey, sortDir, filters]);

    const activeFilterCount = Object.values(filters).flat().length;

    return (
        <>
            <section>
                <div className="sectionHeader">
                    <h2>Liste des étudiants</h2>
                </div>
                <Toolbar
                    searchBar={<SearchBar placeholder="Rechercher un étudiant..." />}
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
                        <ActionButton icon={PlusIcon} filled onClick={() => setShowMessage(true)}>
                            Envoyer un message
                        </ActionButton>
                    }
                />
                <DataTable>
                    <DataTable.Header sortKey={sortKey} sortDir={sortDir} onSort={handleSort}>
                        <DataTable.Row>
                            <DataTable.SortableCell column="name">Nom</DataTable.SortableCell>
                            <DataTable.SortableCell column="class">Groupe</DataTable.SortableCell>
                            <DataTable.Cell>Email</DataTable.Cell>
                            <DataTable.SortableCell column="stageStatus">Statut</DataTable.SortableCell>
                            <DataTable.Cell end>Actions</DataTable.Cell>
                        </DataTable.Row>
                    </DataTable.Header>
                    <DataTable.Body>
                        {displayed.map((student) => (
                            <DataTable.Row key={student.id}>
                                <DataTable.UserCell user={student}>
                                    {student.name}
                                </DataTable.UserCell>
                                <DataTable.Cell muted>{student.class ?? "—"}</DataTable.Cell>
                                <DataTable.Cell muted>{student.email}</DataTable.Cell>
                                <DataTable.Cell>
                                    {student.stageStatus
                                        ? <Tag status={student.stageStatus} />
                                        : <span style={{ color: "var(--text)", fontSize: "14px" }}>—</span>
                                    }
                                </DataTable.Cell>
                                <DataTable.Actions
                                    onEdit={() => {}}
                                    onView={() => {}}
                                    onDelete={() => setDeleteTarget(student)}
                                />
                            </DataTable.Row>
                        ))}
                    </DataTable.Body>
                </DataTable>
            </section>

            <SendMessageModal isOpen={showMessage} onClose={() => setShowMessage(false)} />
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
                message={`Supprimer l'étudiant "${deleteTarget?.name}" ?`}
            />
        </>
    );
}
