import { useState, useEffect, useMemo, useRef } from "react";
import Modal from "@/components/ui/Modal/Modal";
import FormField from "@/components/ui/FormField/FormField";
import { getUsers } from "@/api/users";
import { getGroups } from "@/api/groups";
import { createInternship } from "@/api/internships";
import styles from "./CreateStageModal.module.scss";

const TYPES = ["Bachelier", "Master", "Observation"];

const SCHOOL_YEARS = (() => {
    const y = new Date().getFullYear();
    return [`${y - 1}/${y}`, `${y}/${y + 1}`, `${y + 1}/${y + 2}`];
})();

const empty = { type: "", schoolYear: SCHOOL_YEARS[1], deadline: "", group: "", studentId: "", studentSearch: "" };

export default function CreateStageModal({ isOpen, onClose, onSave }) {
    const [form,       setForm]       = useState(empty);
    const [assignTo,   setAssignTo]   = useState("groupe");
    const [errors,     setErrors]     = useState({});
    const [submitting, setSubmitting] = useState(false);

    const [students, setStudents] = useState([]);
    const [groups,   setGroups]   = useState([]);

    const [searchOpen, setSearchOpen] = useState(false);
    const searchRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return;
        Promise.all([getUsers(), getGroups()])
            .then(([users, groupList]) => {
                setStudents(users.filter((u) => u.role === "etudiant"));
                setGroups(groupList);
            })
            .catch(() => {});
    }, [isOpen]);

    useEffect(() => {
        function handleClickOutside(e) {
            if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const groupOptions = useMemo(() => [
        { value: "", label: "Sélectionner un groupe" },
        ...groups.map((g) => ({ value: g._id, label: g.name })),
    ], [groups]);

    const yearOptions = SCHOOL_YEARS.map((y) => ({ value: y, label: y }));

    const filteredStudents = useMemo(() => {
        const q = form.studentSearch.toLowerCase().trim();
        if (!q) return students.slice(0, 8);
        return students.filter((s) => s.name.toLowerCase().includes(q)).slice(0, 8);
    }, [students, form.studentSearch]);

    const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

    function validate() {
        const e = {};
        if (!form.type)       e.type      = "Le type est requis.";
        if (!form.schoolYear) e.schoolYear = "L'année est requise.";
        if (assignTo === "groupe"   && !form.group)     e.group     = "Le groupe est requis.";
        if (assignTo === "etudiant" && !form.studentId) e.studentId = "L'étudiant est requis.";
        return e;
    }

    async function handleSubmit(ev) {
        ev.preventDefault();
        const e = validate();
        if (Object.keys(e).length) { setErrors(e); return; }

        setSubmitting(true);
        try {
            let studentIds, groupId;

            if (assignTo === "groupe") {
                studentIds = students.filter((s) => s.groupId === form.group).map((s) => s.id);
                groupId    = form.group;
                if (studentIds.length === 0) {
                    setErrors({ group: "Aucun étudiant dans ce groupe." });
                    setSubmitting(false);
                    return;
                }
            } else {
                studentIds = [form.studentId];
            }

            const created = await createInternship({
                students:   studentIds,
                type:       form.type,
                schoolYear: form.schoolYear,
                deadline:   form.deadline || undefined,
                group:      groupId,
            });
            onSave?.(created);
            setForm(empty);
            setErrors({});
            setAssignTo("groupe");
            onClose();
        } catch (err) {
            setErrors({ global: err.response?.data?.error ?? "Une erreur est survenue." });
        } finally {
            setSubmitting(false);
        }
    }

    function handleClose() {
        setForm(empty);
        setErrors({});
        setAssignTo("groupe");
        onClose();
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Ajouter un stage"
            size="sm"
            footer={
                <div className={styles.footer}>
                    <button className={styles.cancelBtn} onClick={handleClose} type="button">Annuler</button>
                    <button className={styles.saveBtn} form="createStageForm" type="submit" disabled={submitting}>
                        {submitting ? "Enregistrement…" : "Enregistrer"}
                    </button>
                </div>
            }
        >
            <form id="createStageForm" onSubmit={handleSubmit} className={styles.form}>
                {errors.global && <p className={styles.error}>{errors.global}</p>}

                <div className={styles.fieldGroup}>
                    <p className={styles.groupLabel}>Type de stage</p>
                    <div className={styles.chips}>
                        {TYPES.map((t) => (
                            <button key={t} type="button"
                                className={`${styles.chip} ${form.type === t ? styles.chipActive : ""}`}
                                onClick={() => setForm((f) => ({ ...f, type: t }))}
                            >{t}</button>
                        ))}
                    </div>
                    {errors.type && <p className={styles.error}>{errors.type}</p>}
                </div>

                <div className={styles.row}>
                    <FormField label="Année scolaire" type="select" value={form.schoolYear}
                        onChange={set("schoolYear")} options={yearOptions} error={errors.schoolYear} required />
                    <FormField label="Date limite" type="date" value={form.deadline} onChange={set("deadline")} />
                </div>

                <div className={styles.fieldGroup}>
                    <p className={styles.groupLabel}>Assigner à</p>
                    <div className={styles.chips}>
                        <button type="button"
                            className={`${styles.chip} ${assignTo === "groupe" ? styles.chipActive : ""}`}
                            onClick={() => { setAssignTo("groupe"); setForm((f) => ({ ...f, studentId: "", studentSearch: "" })); }}
                        >Groupe</button>
                        <button type="button"
                            className={`${styles.chip} ${assignTo === "etudiant" ? styles.chipActive : ""}`}
                            onClick={() => { setAssignTo("etudiant"); setForm((f) => ({ ...f, group: "" })); }}
                        >Étudiant</button>
                    </div>
                </div>

                {assignTo === "groupe" && (
                    <FormField label="Groupe" type="select" value={form.group}
                        onChange={set("group")} options={groupOptions} error={errors.group} required />
                )}

                {assignTo === "etudiant" && (
                    <div className={styles.fieldGroup}>
                        <p className={styles.groupLabel}>Étudiant</p>
                        <div className={styles.searchWrap} ref={searchRef}>
                            <input
                                className={styles.searchInput}
                                placeholder="Rechercher un étudiant..."
                                value={form.studentSearch}
                                onChange={(e) => { setForm((f) => ({ ...f, studentSearch: e.target.value, studentId: "" })); setSearchOpen(true); }}
                                onFocus={() => setSearchOpen(true)}
                                autoComplete="off"
                            />
                            {searchOpen && filteredStudents.length > 0 && (
                                <ul className={styles.suggestions}>
                                    {filteredStudents.map((s) => (
                                        <li key={s.id} onMouseDown={() => { setForm((f) => ({ ...f, studentId: s.id, studentSearch: s.name })); setSearchOpen(false); }}>
                                            <span className={styles.suggestName}>{s.name}</span>
                                            {s.class && <span className={styles.suggestGroup}>{s.class}</span>}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        {errors.studentId && <p className={styles.error}>{errors.studentId}</p>}
                    </div>
                )}
            </form>
        </Modal>
    );
}
