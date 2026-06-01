import { SIZES, PROVINCES } from "@/data/company";
import { useCompanyFields } from "@/contexts/CompanyFieldsContext";
import { useAuth } from "@/contexts/AuthContext";
import FormField from "@/components/ui/FormField/FormField";
import TagInput from "@/components/ui/TagInput/TagInput";
import CustomRadio from "@/components/ui/CustomRadio/CustomRadio";
import CustomCheckbox from "@/components/ui/CustomCheckbox/CustomCheckbox";
import LogoUploadField from "@/components/ui/LogoUploadField/LogoUploadField";
import ContactsForm from "@/components/ui/ContactsForm/ContactsForm";
import styles from "./CompanyForm.module.scss";

export default function CompanyForm({ form, setForm, contacts, setContacts, errors, domainSuggestions = [], tagSuggestions = [] }) {
    const { fields } = useCompanyFields();
    const { user } = useAuth();
    const isEducator   = ["teacher", "manager", "admin"].includes(user?.role);
    const canTeacherInfo  = isEducator || user?.role === "limited";
    const canTeacherNotes = isEducator;
    const set    = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

    function toggleCustom(fieldId) {
        setForm((f) => ({
            ...f,
            customValues: { ...f.customValues, [fieldId]: !f.customValues?.[fieldId] },
        }));
    }

    return (
        <div className={styles.form}>
            <LogoUploadField
                value={form.logo}
                onChange={(url) => setForm((f) => ({ ...f, logo: url }))}
            />

            <div className={styles.row}>
                <FormField
                    label="Nom de l'entreprise"
                    placeholder="Entreprise"
                    value={form.name}
                    onChange={set("name")}
                    error={errors?.name}
                    required
                />
                <FormField
                    label="Site web"
                    placeholder="https://www.exemple.be"
                    value={form.website}
                    onChange={set("website")}
                />
            </div>
            <div className={styles.row}>
                <TagInput
                    label="Domaines"
                    placeholder="Informatique, Finance…"
                    values={form.domains}
                    onChange={(v) => setForm((f) => ({ ...f, domains: v }))}
                    suggestions={domainSuggestions}
                />
                <TagInput
                    label="Secteurs"
                    placeholder="Web, Backend, Mobile…"
                    values={form.tags}
                    onChange={(v) => setForm((f) => ({ ...f, tags: v }))}
                    suggestions={tagSuggestions}
                />
            </div>
            <div className={styles.row}>
                <FormField
                    label="Taille"
                    type="select"
                    value={form.size}
                    onChange={set("size")}
                    options={SIZES}
                />
            </div>
            <div className={styles.row}>
                <FormField
                    label="Téléphone"
                    type="tel"
                    placeholder="+32 4 66 00 00 00"
                    value={form.phone}
                    onChange={set("phone")}
                />
            </div>
            <FormField
                label="Description"
                type="textarea"
                placeholder="Décrivez l'entreprise…"
                value={form.description}
                onChange={set("description")}
                rows={3}
            />

            <p className={styles.groupLabel}>Adresse</p>
            <FormField
                label="Rue"
                placeholder="Rue de l'Informatique 1"
                value={form.street}
                onChange={set("street")}
            />
            <div className={styles.row}>
                <FormField
                    label="Ville"
                    placeholder="Liège"
                    value={form.city}
                    onChange={set("city")}
                />
                <FormField
                    label="Code postal"
                    placeholder="4000"
                    value={form.postalCode}
                    onChange={set("postalCode")}
                />
            </div>

            <div className={styles.fieldGroup}>
                <p className={styles.groupLabel}>Lieu du stage</p>
                <div className={styles.radioGroup}>
                    <CustomRadio
                        name="locationType"
                        value="belgique"
                        checked={form.locationType === "belgique"}
                        onChange={() =>
                            setForm((f) => ({ ...f, locationType: "belgique" }))
                        }
                    >
                        Belgique
                    </CustomRadio>
                    <CustomRadio
                        name="locationType"
                        value="autre"
                        checked={form.locationType === "autre"}
                        onChange={() =>
                            setForm((f) => ({ ...f, locationType: "autre" }))
                        }
                    >
                        Autre pays
                    </CustomRadio>
                </div>
                {form.locationType === "belgique" ? (
                    <FormField
                        label="Province"
                        type="select"
                        value={form.province}
                        onChange={set("province")}
                        options={PROVINCES}
                    />
                ) : (
                    <FormField
                        label="Pays"
                        placeholder="France, Pays-Bas…"
                        value={form.country}
                        onChange={set("country")}
                    />
                )}
            </div>

            <ContactsForm contacts={contacts} onChange={setContacts} />

            {fields.length > 0 && (
                <div className={styles.checkboxRow}>
                    {fields.map((field) => (
                        <CustomCheckbox
                            key={field._id}
                            checked={!!form.customValues?.[field._id]}
                            onChange={() => toggleCustom(field._id)}
                        >
                            {field.label}
                        </CustomCheckbox>
                    ))}
                </div>
            )}

            {canTeacherInfo && (
                <FormField
                    label="Informations aux enseignants"
                    type="textarea"
                    placeholder="Informations réservées aux enseignants et à l'entreprise…"
                    value={form.teacherInfo}
                    onChange={set("teacherInfo")}
                    rows={3}
                    info="Visible par les enseignants et l'entreprise elle-même. Invisible aux étudiants."
                />
            )}
            {canTeacherNotes && (
                <FormField
                    label="Notes des enseignants"
                    type="textarea"
                    placeholder="Notes internes, invisibles à l'entreprise et aux étudiants."
                    value={form.teacherNotes}
                    onChange={set("teacherNotes")}
                    rows={3}
                    info="Visible uniquement par les enseignants. Invisible à l'entreprise et aux étudiants."
                />
            )}
        </div>
    );
}

