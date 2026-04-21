import { useState, useRef, useEffect } from "react";
import ActionButton from "@/components/ui/ActionButton/ActionButton";
import styles from "./DropdownActionMenu.module.scss";

export default function DropdownActionMenu({ icon, items, filled = true }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        function handleOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        }
        document.addEventListener("mousedown", handleOutside);
        return () => document.removeEventListener("mousedown", handleOutside);
    }, []);

    return (
        <div ref={ref} className={styles.wrap}>
            <ActionButton icon={icon} filled={filled} onClick={() => setOpen((v) => !v)} />
            {open && (
                <div className={styles.menu}>
                    {items.map((item, i) => (
                        <button
                            key={i}
                            onClick={() => { setOpen(false); item.onClick(); }}
                            style={item.danger ? { color: "#ef4444" } : undefined}
                            disabled={item.disabled}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
