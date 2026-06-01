import { createContext, useContext, useState, useEffect } from "react";
import {
    getCompanyFields,
    createCompanyField,
    updateCompanyField,
    deleteCompanyField,
} from "@/api/companyFields";

const CompanyFieldsContext = createContext(null);

export function CompanyFieldsProvider({ children }) {
    const [fields, setFields] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCompanyFields()
            .then(setFields)
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    async function addField(label) {
        const field = await createCompanyField(label);
        setFields((prev) => [...prev, field]);
        return field;
    }

    async function editField(id, label) {
        const field = await updateCompanyField(id, label);
        setFields((prev) => prev.map((f) => (f._id === id ? field : f)));
    }

    async function removeField(id) {
        await deleteCompanyField(id);
        setFields((prev) => prev.filter((f) => f._id !== id));
    }

    return (
        <CompanyFieldsContext.Provider value={{ fields, loading, addField, editField, removeField }}>
            {children}
        </CompanyFieldsContext.Provider>
    );
}

export function useCompanyFields() {
    return useContext(CompanyFieldsContext);
}
