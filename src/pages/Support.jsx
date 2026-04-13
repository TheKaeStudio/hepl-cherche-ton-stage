import styles from "./Support.module.scss";
import EmailIcon from "@mui/icons-material/EmailOutlined";
import PhoneIcon from "@mui/icons-material/PhoneOutlined";
import HelpIcon from "@mui/icons-material/HelpOutlineOutlined";

const FAQ = [
    {
        q: "Comment trouver un stage ?",
        a: "Utilisez la page Rechercher un stage pour explorer les entreprises partenaires et leurs offres disponibles.",
    },
    {
        q: "Comment contacter une entreprise ?",
        a: "Depuis la fiche d'une entreprise, vous pouvez envoyer un mail ou appeler directement le responsable de stage.",
    },
    {
        q: "Comment suivre l'avancement de mon stage ?",
        a: "Rendez-vous dans Mes stages pour consulter les informations et le statut de chacun de vos stages.",
    },
    {
        q: "J'ai un problème technique, que faire ?",
        a: "Contactez le support en utilisant les coordonnées ci-dessous. Décrivez votre problème avec le plus de détails possible.",
    },
];

export default function Support() {
    return (
        <section>
            <div className="sectionHeader">
                <h2>Aide & Support</h2>
                <p>Trouvez des réponses à vos questions ou contactez-nous directement.</p>
            </div>
            <div className={styles.grid}>
                <div className={styles.contact}>
                    <p className={styles.cardTitle}>Nous contacter</p>
                    <a href="mailto:support@hepl.be" className={styles.contactItem}>
                        <div className={styles.contactIcon}><EmailIcon /></div>
                        <div>
                            <p className={styles.contactLabel}>Par e-mail</p>
                            <p className={styles.contactValue}>support@hepl.be</p>
                        </div>
                    </a>
                    <a href="tel:+3242252525" className={styles.contactItem}>
                        <div className={styles.contactIcon}><PhoneIcon /></div>
                        <div>
                            <p className={styles.contactLabel}>Par téléphone</p>
                            <p className={styles.contactValue}>+32 4 225 25 25</p>
                        </div>
                    </a>
                </div>
                <div className={styles.faq}>
                    <p className={styles.cardTitle}>Questions fréquentes</p>
                    <ul className={styles.faqList}>
                        {FAQ.map((item, i) => (
                            <li key={i} className={styles.faqItem}>
                                <div className={styles.faqIcon}><HelpIcon /></div>
                                <div>
                                    <p className={styles.faqQuestion}>{item.q}</p>
                                    <p className={styles.faqAnswer}>{item.a}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}
