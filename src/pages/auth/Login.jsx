import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormField from "@/components/ui/FormField/FormField";
import { useAuth } from "@/contexts/AuthContext";
import { signIn } from "@/api/auth";
import styles from "./Login.module.scss";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    function validate() {
        const e = {};
        if (!email) e.email = "L'adresse e-mail est requise.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            e.email = "Adresse e-mail invalide.";
        if (!password) e.password = "Le mot de passe est requis.";
        return e;
    }

    async function handleSubmit(ev) {
        ev.preventDefault();
        const e = validate();
        if (Object.keys(e).length) { setErrors(e); return; }

        setLoading(true);
        try {
            const { token, user } = await signIn(email, password);
            login(token, user);
            navigate("/");
        } catch (err) {
            if (err.response?.data?.code === "EMAIL_NOT_VERIFIED") {
                navigate("/verify-email");
                return;
            }
            const msg = err.response?.data?.error ?? "Identifiants incorrects.";
            setErrors({ global: msg });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>Connexion</h1>
                <p className={styles.subtitle}>
                    Connectez-vous à votre compte pour accéder à la plateforme.
                </p>
            </div>
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
                {errors.global && <p className={styles.globalError}>{errors.global}</p>}
                <FormField
                    label="Adresse e-mail"
                    type="email"
                    placeholder="vous@hepl.be"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={errors.email}
                    autoComplete="email"
                    required
                />
                <FormField
                    label="Mot de passe"
                    type="password"
                    placeholder="Votre mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={errors.password}
                    autoComplete="current-password"
                    required
                />
                <button type="submit" className={styles.submit} disabled={loading}>
                    {loading ? "Connexion…" : "Se connecter"}
                </button>
            </form>
            <p className={styles.footer}>
                Pas encore de compte ?{" "}
                <Link to="/signup" className={styles.link}>Créer un compte</Link>
            </p>
        </div>
    );
}
