import { useState } from "react";
import Modal from "@/components/ui/Modal/Modal";
import FormField from "@/components/ui/FormField/FormField";
import { users, companies } from "@/data/mock";
import styles from "./CreateStageModal.module.scss";

const TYPES = ["Bachelier", "Master", "Observation"];

const GROUPS = [
    { value: "", label: "Sélectionner un groupe" },
    { value: "D301", label: "D301" },
    { value: "D302", label: "D302" },
    { value: "D303", label: "D303" },
    { value: "D201", label: "D201" },
    { value: "D202", label: "D202" },
];

const STUDENTS = [
    { value: "", label: "Sélectionner un étudiant" },
    ...users
        .filter((u) => u.role === "etudiant")
        .map((u) => ({ value: String(u.id), label: u.name })),
];

const COMPANIES = [
    { value: "", label: "Sélectionner une entreprise" },
    ...companies.map((c) => ({ value: String(c.id), label: c.name })),
];

const empty = {
    type: "",
    group: "",
    studentId: "",
    companyId: "",
    supervisor: "",
    startDate: "",
    endDate: "",
};

export default function CreateStageModal({ isOpen, onClose, onSave }) {
    const [form, setForm] = useState(empty);
    const [errors, setErrors] = useState({});

    const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

    function validate() {
        const e = {};
        if (!form.type) e.type = "Le type de stage est requis.";
        if (!form.group) e.group = "Le groupe est requis.";
        if (!form.studentId) e.studentId = "L'étudiant est requis.";
        if (!form.companyId) e.companyId = "L'entreprise est requise.";
        if (!form.startDate) e.startDate = "La date de début est requise.";
        if (!form.endDate) e.endDate = "La date de fin est requise.";
        return e;
    }

    function handleSubmit(ev) {
        ev.preventDefault();
        const e = validate();
        if (Object.keys(e).length) { setErrors(e); return; }
        const student = users.find((u) => String(u.id) === form.studentId);
        const company = companies.find((c) => String(c.id) === form.companyId);
        onSave?.({
            title: `Stage ${form.type}`,
            group: form.group,
            student,
            company,
            supervisor: form.supervisor,
            startDate: form.startDate,
            endDate: form.endDate,
            status: "non-rempli",
        });
        setForm(empty);
        setErrors({});
        onClose();
    }

    function handleClose() {
        setForm(empty);
        setErrors({});
        onClose();
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Ajouter un stage"
            size="lg"
            footer={
                <div className={styles.footer}>
                    <button className={styles.cancelBtn} onClick={handleClose} type="button">
                        Annuler
                    </button>
                    <button className={styles.saveBtn} form="createStageForm" type="submit">
                        Enregistrer
                    </button>
                </div>
            }
        >
            <form id="createStageForm" onSubmit={handleSubmit} className={styles.form}>
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

                <div className={styles.row}>
                    <FormField
                        label="Groupe concerné"
                        type="select"
                        value={form.group}
                        onChange={set("group")}
                        options={GROUPS}
                        error={errors.group}
                        required
                    />
                    <FormField
                        label="Étudiant"
                        type="select"
                        value={form.studentId}
                        onChange={set("studentId")}
                        options={STUDENTS}
                        error={errors.studentId}
                        required
                    />
                </div>

                <div className={styles.row}>
                    <FormField
                        label="Entreprise"
                        type="select"
                        value={form.companyId}
                        onChange={set("companyId")}
                        options={COMPANIES}
                        error={errors.companyId}
                        required
                    />
                    <FormField
                        label="Superviseur"
                        placeholder="Prénom Nom"
                        value={form.supervisor}
                        onChange={set("supervisor")}
                    />
                </div>

                <div className={styles.row}>
                    <FormField
                        label="Date de début"
                        type="date"
                        value={form.startDate}
                        onChange={set("startDate")}
                        error={errors.startDate}
                        required
                    />
                    <FormField
                        label="Date de fin"
                        type="date"
                        value={form.endDate}
                        onChange={set("endDate")}
                        error={errors.endDate}
                        required
                    />
                </div>
            </form>
        </Modal>
    );
}
