import { useState, useMemo } from "react";
import { ROLE_LABEL } from "@/data/mock";
import { getUsers, deleteUser } from "@/api/users";
import { usePaginatedList } from "@/hooks/usePaginatedList";
import SearchBar from "@/components/ui/SearchBar/SearchBar";
import ActionButton from "@/components/ui/ActionButton/ActionButton";
import Toolbar from "@/components/layout/Toolbar/Toolbar";
import DataTable from "@/components/dataTable/DataTable";
import LoadMore from "@/components/ui/LoadMore/LoadMore";
import SendMessageModal from "./SendMessageModal";
import EditUserModal from "./EditUserModal";
import UserSheet from "@/components/sheets/UserSheet";
import DeleteConfirm from "@/components/ui/DeleteConfirm/DeleteConfirm";
import FilterModal from "./FilterModal";

import SortIcon   from "@mui/icons-material/ImportExport";
import FilterIcon from "@mui/icons-material/FilterList";
import MessageIcon from "@mui/icons-material/MailOutlined";

const FILTER_CONFIG = [
    {
        key: "role",
        label: "Rôle",
        options: [
            { value: "etudiant",   label: "Étudiant"      },
            { value: "enseignant", label: "Enseignant"     },
            { value: "manager",    label: "Manager"        },
            { value: "admin",      label: "Administrateur" },
        ],
    },
];

export default function Utilisateurs() {
    const { items: users, loading, loadingMore, hasMore, total, loadMore, setItems: setUsers } =
        usePaginatedList((params) => getUsers(params), 20);

    const [showMessage,  setShowMessage]  = useState(false);
    const [viewTarget,   setViewTarget]   = useState(null);
    const [editTarget,   setEditTarget]   = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [sortKey,      setSortKey]      = useState(null);
    const [sortDir,      setSortDir]      = useState("asc");
    const [showFilter,   setShowFilter]   = useState(false);
    const [filters,      setFilters]      = useState({});

    function handleUserSaved(updated) {
        setUsers((prev) => prev.map((u) => u.id === updated.id ? updated : u));
    }

    function handleSort(key) {
        if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        else { setSortKey(key); setSortDir("asc"); }
    }

    const displayed = useMemo(() => {
        let list = [...users];
        if (filters.role?.length) list = list.filter((u) => filters.role.includes(u.role));
        if (sortKey) {
            list.sort((a, b) => {
                const cmp = String(a[sortKey] ?? "").localeCompare(String(b[sortKey] ?? ""), "fr");
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
                        <ActionButton icon={MessageIcon} filled onClick={() => setShowMessage(true)}>
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
                            <DataTable.Cell end>Actions</DataTable.Cell>
                        </DataTable.Row>
                    </DataTable.Header>
                    <DataTable.Body loading={loading}>
                        {displayed.map((user) => (
                            <DataTable.Row key={user.id}>
                                <DataTable.UserCell user={user}>{user.name}</DataTable.UserCell>
                                <DataTable.Cell muted>{ROLE_LABEL[user.role] ?? user.role}</DataTable.Cell>
                                <DataTable.Cell muted>{user.email}</DataTable.Cell>
                                <DataTable.Actions
                                    onView={() => setViewTarget(user)}
                                    onEdit={() => setEditTarget(user)}
                                    onDelete={() => setDeleteTarget(user)}
                                />
                            </DataTable.Row>
                        ))}
                    </DataTable.Body>
                </DataTable>
                <LoadMore hasMore={hasMore} loading={loadingMore} onLoadMore={loadMore} count={users.length} total={total} />
            </section>

            <UserSheet user={viewTarget} onClose={() => setViewTarget(null)} />
            <SendMessageModal isOpen={showMessage} onClose={() => setShowMessage(false)} />
            <EditUserModal user={editTarget} onClose={() => setEditTarget(null)} onSave={handleUserSaved} />
            <FilterModal isOpen={showFilter} onClose={() => setShowFilter(false)} config={FILTER_CONFIG} values={filters} onChange={setFilters} />
            <DeleteConfirm
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={async () => {
                    const target = deleteTarget;
                    if (!target?.id) return;
                    setDeleteTarget(null);
                    await deleteUser(target.id).catch(() => {});
                    setUsers((prev) => prev.filter((u) => u.id !== target.id));
                }}
                message={`Supprimer l'utilisateur "${deleteTarget?.name}" ?`}
            />
        </>
    );
}
