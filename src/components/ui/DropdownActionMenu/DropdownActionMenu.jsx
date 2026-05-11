import { useState, useRef, useEffect } from "react";
import ActionButton from "@/components/ui/ActionButton/ActionButton";
import styles from "./DropdownActionMenu.module.scss";

export default function DropdownActionMenu({ icon, items, filled = true }) {
    const [open,      setOpen]      = useState(false);
    const [openRight, setOpenRight] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        function handleOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        }
        document.addEventListener("mousedown", handleOutside);
        return () => document.removeEventListener("mousedown", handleOutside);
    }, []);

    function handleToggle() {
        if (!open && ref.current) {
            const { left } = ref.current.getBoundingClientRect();
            setOpenRight(left < 220);
        }
        setOpen((v) => !v);
    }

    return (
        <div ref={ref} className={styles.wrap}>
            <ActionButton icon={icon} filled={filled} onClick={handleToggle} />
            {open && (
                <div className={`${styles.menu} ${openRight ? styles.menuRight : ""}`}>
                    {items.map((item, i) => (
                        <button
                            key={i}
                            className={item.danger ? styles.dangerBtn : undefined}
                            onClick={() => { setOpen(false); item.onClick(); }}
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
