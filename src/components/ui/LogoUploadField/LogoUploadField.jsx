import { useRef, useState } from "react";
import { uploadImage } from "@/api/upload";
import PhotoIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import styles from "./LogoUploadField.module.scss";

export default function LogoUploadField({
    value,
    onChange,
    label = "Logo de l'entreprise",
    hint  = "Cliquez pour uploader une image (max 5 Mo)",
}) {
    const fileRef = useRef(null);
    const [uploading, setUploading] = useState(false);

    async function handleChange(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const url = await uploadImage(file);
            onChange(url);
        } catch { /* ignore */ }
        finally { setUploading(false); }
    }

    return (
        <div className={styles.section}>
            <input ref={fileRef} type="file" accept="image/*" className={styles.hiddenInput} onChange={handleChange} />
            <div className={styles.wrap} onClick={() => fileRef.current?.click()}>
                {value ? (
                    <img src={value} alt="Logo" className={styles.img} />
                ) : (
                    <div className={styles.placeholder}>
                        <PhotoIcon />
                        <span>Logo</span>
                    </div>
                )}
                {uploading && <div className={styles.overlay}>Envoi…</div>}
            </div>
            {(label || hint) && (
                <div className={styles.hint}>
                    {label && <p className={styles.title}>{label}</p>}
                    {hint  && <p className={styles.sub}>{hint}</p>}
                </div>
            )}
        </div>
    );
}
