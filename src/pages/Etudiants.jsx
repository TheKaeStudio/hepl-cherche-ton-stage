import { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getUsers, updateUser, deleteUser, clearAllGroups } from "@/api/users";
import { getGroups } from "@/api/groups";
import { usePaginatedList } from "@/hooks/usePaginatedList";
import SearchBar from "@/components/ui/SearchBar/SearchBar";
import ActionButton from "@/components/ui/ActionButton/ActionButton";
import DropdownActionMenu from "@/components/ui/DropdownActionMenu/DropdownActionMenu";
import Toolbar from "@/components/layout/Toolbar/Toolbar";
import DataTable from "@/components/dataTable/DataTable";
import Modal from "@/components/ui/Modal/Modal";
import FormField from "@/components/ui/FormField/FormField";
import Tag from "@/components/ui/Tag/Tag";
import LoadMore from "@/components/ui/LoadMore/LoadMore";
import UserSheet from "@/components/sheets/UserSheet";
import DeleteConfirm from "@/components/ui/DeleteConfirm/DeleteConfirm";
import FilterModal from "./FilterModal";
import SendMessageModal from "./SendMessageModal";
import GestionGroupesModal from "./GestionGroupesModal";
import styles from "./Etudiants.module.scss";

import SortIcon   from "@mui/icons-material/ImportExport";
import FilterIcon from "@mui/icons-material/FilterList";
import AddIcon    from "@mui/icons-material/Add";

export default function Etudiants() {
    const { user: currentUser } = useAuth();
    const isManager = currentUser?.role === "manager" || currentUser?.role === "admin";

    const { items: students, loading, loadingMore, hasMore, total, loadMore, setItems: setStudents } =
        usePaginatedList((params) => getUsers({ ...params, role: "etudiant" }), 20);

    const [groups,     setGroups]     = useState([]);
    const [viewTarget, setViewTarget] = useState(null);
    const [editTarget, setEditTarget] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [editGroup,  setEditGroup]  = useState("");
    const [editSaving, setEditSaving] = useState(false);

    const [showMessage,      setShowMessage]      = useState(false);
    const [showManageGroups, setShowManageGroups] = useState(false);
    const [clearGroupsOpen,  setClearGroupsOpen]  = useState(false);

    const [sortKey,    setSortKey]    = useState(null);
    const [sortDir,    setSortDir]    = useState("asc");
    const [showFilter, setShowFilter] = useState(false);
    const [filters,    setFilters]    = useState({});

    useEffect(() => {
        getGroups().then(setGroups).catch(() => {});
    }, []);

    function handleSort(key) {
        if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        else { setSortKey(key); setSortDir("asc"); }
    }

    async function handleSaveGroup() {
        if (!editTarget) return;
        setEditSaving(true);
        try {
            const updated = await updateUser(editTarget.id, { group: editGroup || null });
            setStudents((prev) => prev.map((s) => s.id === updated.id ? updated : s));
            setEditTarget(null);
        } finally {
            setEditSaving(false);
        }
    }

    const FILTER_CONFIG = useMemo(() => [
        {
            key: "class",
            label: "Groupe",
            options: groups.map((g) => ({ value: g.name, label: g.name })),
        },
    ], [groups]);

    const groupOptions = useMemo(() => [
        { value: "", label: "Aucun groupe" },
        ...groups.map((g) => ({ value: g._id, label: g.name })),
    ], [groups]);

    const displayed = useMemo(() => {
        let list = [...students];
        if (filters.class?.length) list = list.filter((s) => filters.class.includes(s.class));
        if (sortKey) {
            list.sort((a, b) => {
                const cmp = String(a[sortKey] ?? "").localeCompare(String(b[sortKey] ?? ""), "fr");
                return sortDir === "asc" ? cmp : -cmp;
            });
        }
        return list;
    }, [students, sortKey, sortDir, filters]);

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
                    createButton={isManager ? (
                        <DropdownActionMenu
                            icon={AddIcon}
                            items={[
                                { label: "Envoyer un message",               onClick: () => setShowMessage(true) },
                                { label: "Gérer les groupes",                onClick: () => setShowManageGroups(true) },
                                { label: "Réinitialiser tous les groupes",   onClick: () => setClearGroupsOpen(true), danger: true },
                            ]}
                        />
                    ) : null}
                />
                <DataTable>
                    <DataTable.Header sortKey={sortKey} sortDir={sortDir} onSort={handleSort}>
                        <DataTable.Row>
                            <DataTable.SortableCell column="name">Nom</DataTable.SortableCell>
                            <DataTable.SortableCell column="class">Groupe</DataTable.SortableCell>
                            <DataTable.Cell>Email</DataTable.Cell>
                            <DataTable.Cell end>Actions</DataTable.Cell>
                        </DataTable.Row>
                    </DataTable.Header>
                    <DataTable.Body loading={loading}>
                        {displayed.map((student) => (
                            <DataTable.Row key={student.id}>
                                <DataTable.UserCell user={student}>{student.name}</DataTable.UserCell>
                                <DataTable.Cell>
                                    {student.class
                                        ? <ul style={{ listStyle: "none", padding: 0, margin: 0 }}><Tag group={{ name: student.class, color: student.groupColor }} /></ul>
                                        : <span style={{ color: "var(--text)" }}>—</span>}
                                </DataTable.Cell>
                                <DataTable.Cell muted>{student.email}</DataTable.Cell>
                                <DataTable.Actions
                                    onView={() => setViewTarget(student)}
                                    onEdit={isManager ? () => { setEditTarget(student); setEditGroup(student.groupId ?? ""); } : undefined}
                                    onDelete={isManager ? () => setDeleteTarget(student) : undefined}
                                />
                            </DataTable.Row>
                        ))}
                    </DataTable.Body>
                </DataTable>
                <LoadMore hasMore={hasMore} loading={loadingMore} onLoadMore={loadMore} count={students.length} total={total} />
            </section>

            <UserSheet user={viewTarget} onClose={() => setViewTarget(null)} />
            <SendMessageModal isOpen={showMessage} onClose={() => setShowMessage(false)} />
            <GestionGroupesModal
                isOpen={showManageGroups}
                onClose={() => { setShowManageGroups(false); getGroups().then(setGroups).catch(() => {}); }}
            />

            <Modal
                isOpen={!!editTarget}
                onClose={() => setEditTarget(null)}
                title={`Groupe — ${editTarget?.name ?? ""}`}
                size="sm"
                footer={
                    <div className={styles.footer}>
                        <button className={styles.cancelBtn} onClick={() => setEditTarget(null)} type="button">Annuler</button>
                        <button className={styles.saveBtn} onClick={handleSaveGroup} disabled={editSaving}>
                            {editSaving ? "Enregistrement…" : "Enregistrer"}
                        </button>
                    </div>
                }
            >
                <FormField label="Groupe" type="select" value={editGroup} onChange={(e) => setEditGroup(e.target.value)} options={groupOptions} />
            </Modal>

            <FilterModal isOpen={showFilter} onClose={() => setShowFilter(false)} config={FILTER_CONFIG} values={filters} onChange={setFilters} />
            <DeleteConfirm
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={async () => {
                    const target = deleteTarget;
                    if (!target?.id) return;
                    setDeleteTarget(null);
                    await deleteUser(target.id).catch(() => {});
                    setStudents((prev) => prev.filter((s) => s.id !== target.id));
                }}
                message={`Supprimer l'étudiant "${deleteTarget?.name}" ?`}
            />
            <DeleteConfirm
                isOpen={clearGroupsOpen}
                onClose={() => setClearGroupsOpen(false)}
                onConfirm={async () => {
                    setClearGroupsOpen(false);
                    await clearAllGroups().catch(() => {});
                    setStudents((prev) => prev.map((s) => ({ ...s, class: null, groupId: null, groupColor: null })));
                }}
                message="Retirer le groupe de tous les étudiants ? Cette action est irréversible."
            />
        </>
    );
}
