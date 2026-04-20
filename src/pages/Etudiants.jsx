import { useState, useMemo, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getUsers, updateUser, deleteUser } from "@/api/users";
import { getGroups } from "@/api/groups";
import SearchBar from "@/components/ui/SearchBar/SearchBar";
import ActionButton from "@/components/ui/ActionButton/ActionButton";
import Toolbar from "@/components/layout/Toolbar/Toolbar";
import DataTable from "@/components/dataTable/DataTable";
import Modal from "@/components/ui/Modal/Modal";
import FormField from "@/components/ui/FormField/FormField";
import UserSheet from "@/components/sheets/UserSheet";
import DeleteConfirm from "@/components/ui/DeleteConfirm/DeleteConfirm";
import FilterModal from "./FilterModal";
import SendMessageModal from "./SendMessageModal";
import styles from "./Etudiants.module.scss";

import SortIcon from "@mui/icons-material/ImportExport";
import FilterIcon from "@mui/icons-material/FilterList";
import AddIcon from "@mui/icons-material/Add";

export default function Etudiants() {
    const { user: currentUser } = useAuth();
    const isManager = currentUser?.role === "manager" || currentUser?.role === "admin";

    const [students,   setStudents]   = useState([]);
    const [loading,    setLoading]    = useState(true);
    const [groups,     setGroups]     = useState([]);

    const [viewTarget,   setViewTarget]   = useState(null);
    const [editTarget,   setEditTarget]   = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [editGroup,    setEditGroup]    = useState("");
    const [editSaving,   setEditSaving]   = useState(false);

    const [showMessage,     setShowMessage]     = useState(false);
    const [showMenu,        setShowMenu]        = useState(false);
    const [showCreateGroup, setShowCreateGroup] = useState(false);
    const [newGroupName,    setNewGroupName]    = useState("");
    const menuRef = useRef(null);

    const [sortKey,    setSortKey]    = useState(null);
    const [sortDir,    setSortDir]    = useState("asc");
    const [showFilter, setShowFilter] = useState(false);
    const [filters,    setFilters]    = useState({});

    useEffect(() => {
        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        getUsers()
            .then((list) => {
                const studs = list.filter((u) => u.role === "etudiant");
                setStudents(studs);
                const seen = new Set();
                studs.forEach((s) => { if (s.class) seen.add(s.class); });
                setGroups([...seen].sort());
            })
            .finally(() => setLoading(false));
    }, []);

    function handleSort(key) {
        if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        else { setSortKey(key); setSortDir("asc"); }
    }

    function handleCreateGroup() {
        const name = newGroupName.trim().toUpperCase();
        if (!name || groups.includes(name)) return;
        setGroups((prev) => [...prev, name].sort());
        setNewGroupName("");
        setShowCreateGroup(false);
    }

    async function handleSaveGroup() {
        if (!editTarget) return;
        setEditSaving(true);
        try {
            const updated = await updateUser(editTarget.id, { promotion: editGroup || null });
            setStudents((prev) => prev.map((s) => s.id === updated.id ? updated : s));
            if (editGroup && !groups.includes(editGroup)) {
                setGroups((prev) => [...prev, editGroup].sort());
            }
            setEditTarget(null);
        } finally {
            setEditSaving(false);
        }
    }

    const FILTER_CONFIG = useMemo(() => [
        {
            key: "class",
            label: "Groupe",
            options: groups.map((g) => ({ value: g, label: g })),
        },
    ], [groups]);

    const groupOptions = useMemo(() => [
        { value: "", label: "Aucun groupe" },
        ...groups.map((g) => ({ value: g, label: g })),
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
                        <div className={styles.menuWrap} ref={menuRef}>
                            <button className={styles.addBtn} onClick={() => setShowMenu((v) => !v)}>
                                <AddIcon fontSize="small" />
                            </button>
                            {showMenu && (
                                <div className={styles.dropMenu}>
                                    <button onClick={() => { setShowMenu(false); setShowMessage(true); }}>
                                        Envoyer un message
                                    </button>
                                    <button onClick={() => { setShowMenu(false); setShowCreateGroup(true); }}>
                                        Créer un groupe
                                    </button>
                                </div>
                            )}
                        </div>
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
                                <DataTable.Cell muted>{student.class ?? "—"}</DataTable.Cell>
                                <DataTable.Cell muted>{student.email}</DataTable.Cell>
                                <DataTable.Actions
                                    onView={() => setViewTarget(student)}
                                    onEdit={isManager ? () => { setEditTarget(student); setEditGroup(student.class ?? ""); } : undefined}
                                    onDelete={isManager ? () => setDeleteTarget(student) : undefined}
                                />
                            </DataTable.Row>
                        ))}
                    </DataTable.Body>
                </DataTable>
            </section>

            <UserSheet user={viewTarget} onClose={() => setViewTarget(null)} />
            <SendMessageModal isOpen={showMessage} onClose={() => setShowMessage(false)} />

            {/* Modifier groupe étudiant */}
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
                <FormField
                    label="Groupe"
                    type="select"
                    value={editGroup}
                    onChange={(e) => setEditGroup(e.target.value)}
                    options={groupOptions}
                />
            </Modal>

            {/* Créer un groupe */}
            <Modal
                isOpen={showCreateGroup}
                onClose={() => { setShowCreateGroup(false); setNewGroupName(""); }}
                title="Créer un groupe"
                size="sm"
                footer={
                    <div className={styles.footer}>
                        <button className={styles.cancelBtn} onClick={() => setShowCreateGroup(false)} type="button">Annuler</button>
                        <button className={styles.saveBtn} onClick={handleCreateGroup} disabled={!newGroupName.trim()}>Créer</button>
                    </div>
                }
            >
                <FormField
                    label="Nom du groupe"
                    placeholder="ex: D301"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value.toUpperCase())}
                />
            </Modal>

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
                onConfirm={async () => {
                    const target = deleteTarget;
                    if (!target?.id) return;
                    setDeleteTarget(null);
                    await deleteUser(target.id).catch(() => {});
                    setStudents((prev) => prev.filter((s) => s.id !== target.id));
                }}
                message={`Supprimer l'étudiant "${deleteTarget?.name}" ?`}
            />
        </>
    );
}
