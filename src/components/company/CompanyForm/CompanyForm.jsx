import { SIZES, PROVINCES } from "@/data/company";
import FormField from "@/components/ui/FormField/FormField";
import CustomRadio from "@/components/ui/CustomRadio/CustomRadio";
import CustomCheckbox from "@/components/ui/CustomCheckbox/CustomCheckbox";
import LogoUploadField from "@/components/ui/LogoUploadField/LogoUploadField";
import ContactsForm from "@/components/ui/ContactsForm/ContactsForm";
import styles from "./CompanyForm.module.scss";

export default function CompanyForm({ form, setForm, contacts, setContacts, errors, sectorOptions }) {
    const set    = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
    const toggle = (key) => ()  => setForm((f) => ({ ...f, [key]: !f[key] }));

    return (
        <div className={styles.form}>
            <LogoUploadField
                value={form.logo}
                onChange={(url) => setForm((f) => ({ ...f, logo: url }))}
            />

            <div className={styles.row}>
                <FormField label="Nom de l'entreprise" placeholder="EVS Broadcast Equipment" value={form.name} onChange={set("name")} error={errors?.name} required />
                <FormField label="Site web" placeholder="https://www.exemple.be" value={form.website} onChange={set("website")} />
            </div>
            <div className={styles.row}>
                <FormField label="Secteur" type="select" value={form.sector} onChange={set("sector")} options={sectorOptions} />
                <FormField label="Taille" type="select" value={form.size} onChange={set("size")} options={SIZES} />
            </div>
            <div className={styles.row}>
                <FormField label="Téléphone" type="tel" placeholder="+32 4 66 00 00 00" value={form.phone} onChange={set("phone")} />
            </div>
            <FormField label="Description" type="textarea" placeholder="Décrivez l'entreprise…" value={form.description} onChange={set("description")} rows={3} />

            <p className={styles.groupLabel}>Adresse</p>
            <FormField label="Rue" placeholder="Rue de l'Informatique 1" value={form.street} onChange={set("street")} />
            <div className={styles.row}>
                <FormField label="Ville" placeholder="Liège" value={form.city} onChange={set("city")} />
                <FormField label="Code postal" placeholder="4000" value={form.postalCode} onChange={set("postalCode")} />
            </div>

            <div className={styles.fieldGroup}>
                <p className={styles.groupLabel}>Lieu du stage</p>
                <div className={styles.radioGroup}>
                    <CustomRadio name="locationType" value="belgique" checked={form.locationType === "belgique"} onChange={() => setForm((f) => ({ ...f, locationType: "belgique" }))}>
                        Belgique
                    </CustomRadio>
                    <CustomRadio name="locationType" value="autre" checked={form.locationType === "autre"} onChange={() => setForm((f) => ({ ...f, locationType: "autre" }))}>
                        Autre pays
                    </CustomRadio>
                </div>
                {form.locationType === "belgique" ? (
                    <FormField label="Province" type="select" value={form.province} onChange={set("province")} options={PROVINCES} />
                ) : (
                    <FormField label="Pays" placeholder="France, Pays-Bas…" value={form.country} onChange={set("country")} />
                )}
            </div>

            <ContactsForm contacts={contacts} onChange={setContacts} />

            <div className={styles.checkboxRow}>
                <CustomCheckbox checked={form.offresObservation} onChange={toggle("offresObservation")}>
                    Stage d'observation disponible
                </CustomCheckbox>
                <CustomCheckbox checked={form.offres3e} onChange={toggle("offres3e")}>
                    Stage BAC3 disponible
                </CustomCheckbox>
            </div>
        </div>
    );
}

