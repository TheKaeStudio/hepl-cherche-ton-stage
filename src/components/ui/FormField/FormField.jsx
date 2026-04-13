import { useState } from "react";
import VisibilityIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOffOutlined";
import styles from "./FormField.module.scss";

export default function FormField({
    label,
    type = "text",
    placeholder,
    value,
    onChange,
    error,
    hint,
    required,
    autoComplete,
    options,
    rows = 4,
}) {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    const labelEl = label && (
        <label className={styles.label}>
            {label}
            {required && <span className={styles.required}>*</span>}
        </label>
    );

    const messages = (
        <>
            {error && <p className={styles.error}>{error}</p>}
            {hint && !error && <p className={styles.hint}>{hint}</p>}
        </>
    );

    if (type === "select") {
        return (
            <div className={styles.field}>
                {labelEl}
                <div className={styles.selectWrapper}>
                    <select
                        value={value}
                        onChange={onChange}
                        className={`${styles.input} ${styles.select} ${error ? styles.hasError : ""}`}
                    >
                        {options?.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>
                {messages}
            </div>
        );
    }

    if (type === "textarea") {
        return (
            <div className={styles.field}>
                {labelEl}
                <textarea
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    rows={rows}
                    className={`${styles.input} ${styles.textarea} ${error ? styles.hasError : ""}`}
                />
                {messages}
            </div>
        );
    }

    return (
        <div className={styles.field}>
            {labelEl}
            <div className={styles.inputWrapper}>
                <input
                    type={inputType}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    autoComplete={autoComplete}
                    className={`${styles.input} ${error ? styles.hasError : ""}`}
                />
                {isPassword && (
                    <button
                        type="button"
                        className={styles.toggle}
                        onClick={() => setShowPassword((v) => !v)}
                    >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </button>
                )}
            </div>
            {messages}
        </div>
    );
}
