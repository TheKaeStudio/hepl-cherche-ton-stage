import { useRef, useId } from "react";
import { colorFromName, colorBgFromName } from "@/utils/colorFromName";
import styles from "./TagInput.module.scss";

import CloseIcon from "@mui/icons-material/Close";

/**
 * Champ multi-valeurs avec autocomplétion via <datalist>.
 * Les chips ont une couleur déterministe basée sur leur nom (même nom = même couleur partout).
 */
export default function TagInput({ label, placeholder, values = [], onChange, suggestions = [] }) {
    const inputRef = useRef(null);
    const uid = useId();
    const listId = `tagin-${uid}`;

    function addValue(raw) {
        const trimmed = raw.trim();
        if (!trimmed || values.includes(trimmed)) return;
        onChange?.([...values, trimmed]);
    }

    function removeValue(val) {
        onChange?.(values.filter((v) => v !== val));
    }

    function handleKeyDown(e) {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addValue(inputRef.current.value);
            inputRef.current.value = "";
        } else if (e.key === "Backspace" && inputRef.current.value === "" && values.length > 0) {
            removeValue(values[values.length - 1]);
        }
    }

    function handleChange(e) {
        const raw = e.target.value;
        if (raw.endsWith(",")) {
            addValue(raw.slice(0, -1));
            inputRef.current.value = "";
        }
    }

    function handleBlur(e) {
        const val = e.target.value.trim();
        if (val) {
            addValue(val);
            inputRef.current.value = "";
        }
    }

    return (
        <div className={styles.field}>
            {label && <label className={styles.label}>{label}</label>}
            <div className={styles.inputBox} onClick={() => inputRef.current?.focus()}>
                {values.map((val) => (
                    <span
                        key={val}
                        className={styles.chip}
                        style={{ color: colorFromName(val), background: colorBgFromName(val), borderColor: colorFromName(val) }}
                    >
                        {val}
                        <button
                            type="button"
                            className={styles.chipRemove}
                            onClick={(e) => { e.stopPropagation(); removeValue(val); }}
                            aria-label={`Retirer ${val}`}
                        >
                            <CloseIcon fontSize="inherit" />
                        </button>
                    </span>
                ))}
                <input
                    ref={inputRef}
                    list={listId}
                    placeholder={values.length === 0 ? placeholder : ""}
                    onKeyDown={handleKeyDown}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={styles.textInput}
                    autoComplete="off"
                />
            </div>
            <datalist id={listId}>
                {suggestions.filter((s) => !values.includes(s)).map((s) => (
                    <option key={s} value={s} />
                ))}
            </datalist>
        </div>
    );
}
