import { createContext, useContext, useState } from "react";
import { savedCompanies } from "@/data/mock";

const SavedContext = createContext(null);

export function SavedProvider({ children }) {
    const [savedIds, setSavedIds] = useState(
        () => new Set(savedCompanies.map((c) => c.id))
    );

    function toggleSaved(id) {
        setSavedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }

    return (
        <SavedContext.Provider value={{ savedIds, toggleSaved }}>
            {children}
        </SavedContext.Provider>
    );
}

export function useSaved() {
    return useContext(SavedContext);
}
