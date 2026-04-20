import { useState, useEffect, useMemo, useRef } from "react";
import Modal from "@/components/ui/Modal/Modal";
import FormField from "@/components/ui/FormField/FormField";
import { getUsers } from "@/api/users";
import { createInternship } from "@/api/internships";
import styles from "./CreateStageModal.module.scss";

const TYPES = ["Bachelier", "Master", "Observation"];
const empty = { type: "", group: "", studentId: "", studentSearch: "" };

export default function CreateStageModal({ isOpen, onClose, onSave }) {
    const [form, setForm] = useState(empty);
    const [assignTo, setAssignTo] = useState("groupe");
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [students, setStudents] = useState([]);
    const [searchOpen, setSearchOpen] = useState(false);
    const searchRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return;
        getUsers()
            .then((users) => setStudents(users.filter((u) => u.role === "etudiant")))
            .catch(() => {});
    }, [isOpen]);

    useEffect(() => {
        function handleClickOutside(e) {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setSearchOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const groups = useMemo(() => {
        const seen = new Set();
        const opts = [{ value: "", label: "Sélectionner un groupe" }];
        for (const s of students) {
            if (s.class && !seen.has(s.class)) {
                seen.add(s.class);
                opts.push({ value: s.class, label: s.class });
            }
        }
        return opts;
    }, [students]);

    const filteredStudents = useMemo(() => {
        const q = form.studentSearch.toLowerCase().trim();
        if (!q) return students.slice(0, 8);
        return students.filter((s) => s.name.toLowerCase().includes(q)).slice(0, 8);
    }, [students, form.studentSearch]);

    function handleStudentSelect(student) {
        setForm((f) => ({ ...f, studentId: student.id, studentSearch: student.name }));
        setSearchOpen(false);
    }

    function validate() {
        const e = {};
        if (!form.type) e.type = "Le type de stage est requis.";
        if (assignTo === "groupe" && !form.group) e.group = "Le groupe est requis.";
        if (assignTo === "etudiant" && !form.studentId) e.studentId = "L'étudiant est requis.";
        return e;
    }

    async function handleSubmit(ev) {
        ev.preventDefault();
        const e = validate();
        if (Object.keys(e).length) { setErrors(e); return; }

        setSubmitting(true);
        try {
            const payload = { type: form.type };
            if (assignTo === "groupe") payload.group = form.group;
            else payload.students = [form.studentId];

            const created = await createInternship(payload);
            onSave?.(created);
            setForm(empty);
            setErrors({});
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
                    <button className={styles.cancelBtn} onClick={handleClose} type="button">
                        Annuler
                    </button>
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
                            <button
                                key={t}
                                type="button"
                                className={`${styles.chip} ${form.type === t ? styles.chipActive : ""}`}
                                onClick={() => setForm((f) => ({ ...f, type: t }))}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                    {errors.type && <p className={styles.error}>{errors.type}</p>}
                </div>

                <div className={styles.fieldGroup}>
                    <p className={styles.groupLabel}>Assigner à</p>
                    <div className={styles.chips}>
                        <button
                            type="button"
                            className={`${styles.chip} ${assignTo === "groupe" ? styles.chipActive : ""}`}
                            onClick={() => { setAssignTo("groupe"); setForm((f) => ({ ...f, studentId: "", studentSearch: "" })); }}
                        >
                            Groupe
                        </button>
                        <button
                            type="button"
                            className={`${styles.chip} ${assignTo === "etudiant" ? styles.chipActive : ""}`}
                            onClick={() => { setAssignTo("etudiant"); setForm((f) => ({ ...f, group: "" })); }}
                        >
                            Étudiant
                        </button>
                    </div>
                </div>

                {assignTo === "groupe" && (
                    <FormField
                        label="Groupe"
                        type="select"
                        value={form.group}
                        onChange={(e) => setForm((f) => ({ ...f, group: e.target.value }))}
                        options={groups}
                        error={errors.group}
                        required
                    />
                )}

                {assignTo === "etudiant" && (
                    <div className={styles.fieldGroup}>
                        <p className={styles.groupLabel}>Étudiant</p>
                        <div className={styles.searchWrap} ref={searchRef}>
                            <input
                                className={styles.searchInput}
                                placeholder="Rechercher un étudiant..."
                                value={form.studentSearch}
                                onChange={(e) => {
                                    setForm((f) => ({ ...f, studentSearch: e.target.value, studentId: "" }));
                                    setSearchOpen(true);
                                }}
                                onFocus={() => setSearchOpen(true)}
                                autoComplete="off"
                            />
                            {searchOpen && filteredStudents.length > 0 && (
                                <ul className={styles.suggestions}>
                                    {filteredStudents.map((s) => (
                                        <li key={s.id} onMouseDown={() => handleStudentSelect(s)}>
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
