import { createContext, useContext, useState, useEffect } from "react";
import {
    getSectors,
    createSector,
    updateSector as apiUpdateSector,
    deleteSector as apiDeleteSector,
} from "@/api/sectors";

const SecteurContext = createContext(null);

export function SecteurProvider({ children }) {
    const [sectors, setSectors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getSectors()
            .then(setSectors)
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    async function addSector(name, color) {
        const sector = await createSector({ name, color });
        setSectors((prev) => [...prev, sector]);
        return sector;
    }

    async function updateSector(id, name, color) {
        const sector = await apiUpdateSector(id, { name, color });
        setSectors((prev) => prev.map((s) => s._id === id ? sector : s));
        return sector;
    }

    async function deleteSector(id) {
        await apiDeleteSector(id);
        setSectors((prev) => prev.filter((s) => s._id !== id));
    }

    return (
        <SecteurContext.Provider value={{ sectors, loading, addSector, updateSector, deleteSector }}>
            {children}
        </SecteurContext.Provider>
    );
}

export function useSecteurs() {
    return useContext(SecteurContext);
}
