import Modal from "@/components/ui/Modal/Modal";
import styles from "./FilterModal.module.scss";

/**
 * Generic filter modal.
 *
 * config: Array of filter groups:
 *   { key: string, label: string, options: Array<{ value, label }> }
 *
 * values: { [key]: value[] }  (array of selected values per key)
 * onChange: (newValues) => void
 */
export default function FilterModal({ isOpen, onClose, config = [], values = {}, onChange }) {
    function toggle(key, optValue) {
        const current = values[key] ?? [];
        const next = current.includes(optValue)
            ? current.filter((v) => v !== optValue)
            : [...current, optValue];
        onChange?.({ ...values, [key]: next });
    }

    function reset() {
        const cleared = Object.fromEntries(config.map((g) => [g.key, []]));
        onChange?.(cleared);
    }

    const activeCount = Object.values(values).flat().length;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Filtres"
            size="sm"
            footer={
                <div className={styles.footer}>
                    {activeCount > 0 && (
                        <button className={styles.resetBtn} onClick={reset} type="button">
                            Réinitialiser ({activeCount})
                        </button>
                    )}
                    <button className={styles.applyBtn} onClick={onClose} type="button">
                        Appliquer
                    </button>
                </div>
            }
        >
            <div className={styles.groups}>
                {config.map((group) => (
                    <div key={group.key} className={styles.group}>
                        <p className={styles.groupLabel}>{group.label}</p>
                        <div className={styles.chips}>
                            {group.options.map((opt) => {
                                const checked = (values[group.key] ?? []).includes(opt.value);
                                return (
                                    <label
                                        key={opt.value}
                                        className={`${styles.chip} ${checked ? styles.chipActive : ""}`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={() => toggle(group.key, opt.value)}
                                        />
                                        {opt.label}
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </Modal>
    );
}
