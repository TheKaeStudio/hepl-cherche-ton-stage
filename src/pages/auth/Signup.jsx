import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormField from "@/components/ui/FormField/FormField";
import { signUp } from "@/api/auth";
import styles from "./Signup.module.scss";

export default function Signup() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ firstname: "", lastname: "", email: "", password: "", confirm: "" });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

    function validate() {
        const e = {};
        if (!form.firstname.trim()) e.firstname = "Le prénom est requis.";
        if (!form.lastname.trim())  e.lastname  = "Le nom est requis.";
        if (!form.email) e.email = "L'adresse e-mail est requise.";
        else if (!/^[^\s@]+@(student\.hepl\.be|hepl\.be)$/i.test(form.email.trim()))
            e.email = "L'adresse doit être @student.hepl.be ou @hepl.be.";
        if (!form.password) e.password = "Le mot de passe est requis.";
        else if (form.password.length < 8)
            e.password = "Le mot de passe doit contenir au moins 8 caractères.";
        if (form.password !== form.confirm)
            e.confirm = "Les mots de passe ne correspondent pas.";
        return e;
    }

    async function handleSubmit(ev) {
        ev.preventDefault();
        const e = validate();
        if (Object.keys(e).length) { setErrors(e); return; }

        setLoading(true);
        try {
            await signUp(form.firstname.trim(), form.lastname.trim(), form.email.trim(), form.password);
            navigate("/verify-email");
        } catch (err) {
            const msg = err.response?.data?.error ?? "Une erreur est survenue.";
            setErrors({ global: msg });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>Créer un compte</h1>
                <p className={styles.subtitle}>
                    Rejoignez HEPL Cherche Ton Stage pour gérer vos stages facilement.
                </p>
            </div>
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
                {errors.global && <p className={styles.globalError}>{errors.global}</p>}
                <div className={styles.row}>
                    <FormField
                        label="Prénom"
                        placeholder="Prénom"
                        value={form.firstname}
                        onChange={set("firstname")}
                        error={errors.firstname}
                        autoComplete="given-name"
                        required
                    />
                    <FormField
                        label="Nom"
                        placeholder="Nom de famille"
                        value={form.lastname}
                        onChange={set("lastname")}
                        error={errors.lastname}
                        autoComplete="family-name"
                        required
                    />
                </div>
                <FormField
                    label="Adresse e-mail"
                    type="email"
                    placeholder="vous@hepl.be"
                    value={form.email}
                    onChange={set("email")}
                    error={errors.email}
                    autoComplete="email"
                    required
                />
                <FormField
                    label="Mot de passe"
                    type="password"
                    placeholder="Minimum 8 caractères"
                    value={form.password}
                    onChange={set("password")}
                    error={errors.password}
                    hint="Minimum 8 caractères requis"
                    autoComplete="new-password"
                    required
                />
                <FormField
                    label="Confirmer le mot de passe"
                    type="password"
                    placeholder="Répétez votre mot de passe"
                    value={form.confirm}
                    onChange={set("confirm")}
                    error={errors.confirm}
                    autoComplete="new-password"
                    required
                />
                <button type="submit" className={styles.submit} disabled={loading}>
                    {loading ? "Création…" : "Créer mon compte"}
                </button>
            </form>
            <p className={styles.footer}>
                Déjà un compte ?{" "}
                <Link to="/login" className={styles.link}>Se connecter</Link>
            </p>
        </div>
    );
}
