import { useState, useMemo, useEffect } from "react";
import { ROLE_LABEL } from "@/data/mock";
import { getUsers } from "@/api/users";
import SearchBar from "@/components/ui/SearchBar/SearchBar";
import ActionButton from "@/components/ui/ActionButton/ActionButton";
import Toolbar from "@/components/layout/Toolbar/Toolbar";
import DataTable from "@/components/dataTable/DataTable";
import SendMessageModal from "./SendMessageModal";
import DeleteConfirm from "@/components/ui/DeleteConfirm/DeleteConfirm";
import FilterModal from "./FilterModal";

import SortIcon from "@mui/icons-material/ImportExport";
import FilterIcon from "@mui/icons-material/FilterList";
import PlusIcon from "@mui/icons-material/Add";

const FILTER_CONFIG = [
    {
        key: "role",
        label: "Rôle",
        options: [
            { value: "etudiant", label: "Étudiant" },
            { value: "enseignant", label: "Enseignant" },
            { value: "admin", label: "Administrateur" },
        ],
    },
];

export default function Utilisateurs() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showMessage, setShowMessage] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [sortKey, setSortKey] = useState(null);
    const [sortDir, setSortDir] = useState("asc");
    const [showFilter, setShowFilter] = useState(false);
    const [filters, setFilters] = useState({});

    useEffect(() => {
        getUsers()
            .then(setUsers)
            .finally(() => setLoading(false));
    }, []);

    function handleSort(key) {
        if (sortKey === key) {
            setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        } else {
            setSortKey(key);
            setSortDir("asc");
        }
    }

    const displayed = useMemo(() => {
        let list = [...users];

        if (filters.role?.length) {
            list = list.filter((u) => filters.role.includes(u.role));
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
    }, [users, sortKey, sortDir, filters]);

    const activeFilterCount = Object.values(filters).flat().length;

    return (
        <>
            <section>
                <div className="sectionHeader">
                    <h2>Liste des utilisateurs</h2>
                </div>
                <Toolbar
                    searchBar={<SearchBar placeholder="Rechercher un utilisateur..." />}
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
                            <DataTable.SortableCell column="role">Rôle</DataTable.SortableCell>
                            <DataTable.Cell>Email</DataTable.Cell>
                            <DataTable.Cell>Téléphone</DataTable.Cell>
                            <DataTable.Cell end>Actions</DataTable.Cell>
                        </DataTable.Row>
                    </DataTable.Header>
                    <DataTable.Body loading={loading}>
                        {displayed.map((user) => (
                            <DataTable.Row key={user.id}>
                                <DataTable.UserCell user={user}>
                                    {user.name}
                                </DataTable.UserCell>
                                <DataTable.Cell muted>{ROLE_LABEL[user.role] ?? user.role}</DataTable.Cell>
                                <DataTable.Cell muted>{user.email}</DataTable.Cell>
                                <DataTable.Cell muted>{user.phone}</DataTable.Cell>
                                <DataTable.Actions
                                    onEdit={() => {}}
                                    onView={() => {}}
                                    onDelete={() => setDeleteTarget(user)}
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
                message={`Supprimer l'utilisateur "${deleteTarget?.name}" ?`}
            />
        </>
    );
}
