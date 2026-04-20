import { createContext, useContext, useState } from "react";

const STORAGE_KEY = "savedCompanyIds";

const SavedContext = createContext(null);

export function SavedProvider({ children }) {
    const [savedIds, setSavedIds] = useState(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return new Set(raw ? JSON.parse(raw) : []);
        } catch {
            return new Set();
        }
    });

    function toggleSaved(id) {
        setSavedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
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
