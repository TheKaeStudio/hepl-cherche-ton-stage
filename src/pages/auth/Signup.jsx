import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormField from "@/components/ui/FormField/FormField";
import styles from "./Signup.module.scss";

export default function Signup() {
    const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

    function validate() {
        const e = {};
        if (!form.name.trim()) e.name = "Le nom complet est requis.";
        if (!form.email) e.email = "L'adresse e-mail est requise.";
        else if (!/^[^\s@]+@(student\.hepl\.be|hepl\.be)$/.test(form.email.trim().toLowerCase()))
            e.email = "L'adresse doit être un @student.hepl.be ou @hepl.be.";
        if (!form.password) e.password = "Le mot de passe est requis.";
        else if (form.password.length < 8)
            e.password = "Le mot de passe doit contenir au moins 8 caractères.";
        if (!form.confirm) e.confirm = "Veuillez confirmer votre mot de passe.";
        else if (form.password !== form.confirm)
            e.confirm = "Les mots de passe ne correspondent pas.";
        return e;
    }

    function handleSubmit(ev) {
        ev.preventDefault();
        const e = validate();
        if (Object.keys(e).length) { setErrors(e); return; }
        navigate("/");
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
                <FormField
                    label="Nom complet"
                    placeholder="Prénom Nom"
                    value={form.name}
                    onChange={set("name")}
                    error={errors.name}
                    autoComplete="name"
                    required
                />
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
                <button type="submit" className={styles.submit}>
                    Créer mon compte
                </button>
            </form>
            <p className={styles.footer}>
                Déjà un compte ?{" "}
                <Link to="/login" className={styles.link}>Se connecter</Link>
            </p>
        </div>
    );
}
