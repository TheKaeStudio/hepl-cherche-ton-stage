import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCompany, updateCompany, getCompanyMeta } from "@/api/companies";
import CompanyForm from "@/components/company/CompanyForm/CompanyForm";
import { emptyContact } from "@/components/ui/ContactsForm/ContactsForm";
import styles from "./EditCompanyPage.module.scss";

import ArrowBack from "@mui/icons-material/ArrowBack";

const emptyForm = () => ({
    name: "", domains: [], tags: [], customValues: {}, size: "", website: "", phone: "", description: "",
    street: "", city: "", postalCode: "", province: "", country: "",
    locationType: "belgique", logo: null,
});

export default function EditCompanyPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [form, setForm] = useState(emptyForm);
    const [contacts, setContacts] = useState([emptyContact()]);
    const [meta, setMeta] = useState({ domains: [], tags: [] });

    useEffect(() => {
        getCompanyMeta().then(setMeta).catch(() => {});
    }, []);

    useEffect(() => {
        getCompany(id)
            .then((c) => {
                const hasProvince = !!c.address?.province;
                setForm({
                    name:         c.name ?? "",
                    domains:      c.domains ?? [],
                    tags:         c.tags    ?? [],
                    customValues: c.customValues ?? {},
                    size: c.size ?? "",
                    website: c.website ?? "",
                    phone: c.phone ?? "",
                    description: c.description ?? "",
                    street: c.address?.street ?? "",
                    city: c.address?.city ?? "",
                    postalCode: c.address?.postalCode ?? "",
                    province: c.address?.province ?? "",
                    country: c.address?.country ?? "",
                    locationType: hasProvince ? "belgique" : "autre",
                    logo: c.logo ?? null,
                    offresObservation: c.offresObservation ?? false,
                    offres3e: c.offres3e ?? false,
                });
                const raw = c.contacts?.length
                    ? c.contacts
                    : c.contact
                      ? [c.contact]
                      : [];
                if (raw.length)
                    setContacts(
                        raw.map((ct) => ({
                            name: ct.name ?? "",
                            email: ct.email ?? "",
                            phone: ct.phone ?? "",
                            visibility: ct.visibility ?? "public",
                        })),
                    );
            })
            .catch(() => navigate("/entreprises"))
            .finally(() => setLoading(false));
    }, [id, navigate]);

    async function handleSubmit(e) {
        e.preventDefault();
        if (!form.name.trim()) {
            setErrors({ name: "Le nom est requis." });
            return;
        }
        setSubmitting(true);
        setErrors({});

        const validContacts = contacts
            .filter((c) => c.name.trim())
            .map((c) => ({
                name: c.name,
                email: c.email || undefined,
                phone: c.phone || undefined,
                visibility: c.visibility || "public",
            }));

        try {
            await updateCompany(id, {
                name: form.name,
                description: form.description || undefined,
                domains:      form.domains,
                tags:         form.tags,
                customValues: form.customValues,
                size: form.size || undefined,
                website: form.website || undefined,
                phone: form.phone || undefined,
                logo: form.logo || undefined,
                address: {
                    street: form.street || undefined,
                    city: form.city || undefined,
                    postalCode: form.postalCode || undefined,
                    province:
                        form.locationType === "belgique"
                            ? form.province || undefined
                            : undefined,
                    country:
                        form.locationType === "belgique"
                            ? "Belgique"
                            : form.country || undefined,
                },
                contact: validContacts[0] ?? undefined,
                contacts: validContacts,
                offresObservation: form.offresObservation,
                offres3e: form.offres3e,
            });
            navigate("/entreprises");
        } catch (err) {
            setErrors({
                global: err.response?.data?.error ?? "Une erreur est survenue.",
            });
        } finally {
            setSubmitting(false);
        }
    }

    if (loading)
        return (
            <section>
                <p className={styles.loadingText}>Chargement…</p>
            </section>
        );

    return (
        <section>
            <div className="sectionHeader">
                <div className={styles.headerRow}>
                    <button
                        className={styles.backBtn}
                        onClick={() => navigate(-1)}
                        type="button"
                    >
                        <ArrowBack fontSize="small" /> Retour
                    </button>
                    <h2>Modifier l'entreprise</h2>
                </div>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
                {errors.global && (
                    <p className={styles.error}>{errors.global}</p>
                )}
                <CompanyForm
                    form={form}
                    setForm={setForm}
                    contacts={contacts}
                    setContacts={setContacts}
                    errors={errors}
                    domainSuggestions={meta.domains}
                    tagSuggestions={meta.tags}
                />
                <div className={styles.formFooter}>
                    <button
                        type="button"
                        className={styles.cancelBtn}
                        onClick={() => navigate(-1)}
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        className={styles.saveBtn}
                        disabled={submitting}
                    >
                        {submitting ? "Enregistrement…" : "Enregistrer"}
                    </button>
                </div>
            </form>
        </section>
    );
}
