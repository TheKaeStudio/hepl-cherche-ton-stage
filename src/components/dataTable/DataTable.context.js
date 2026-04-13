import { createContext, useContext } from "react";

export const TableContext = createContext({ isHeader: false });
export const useTableContext = () => useContext(TableContext);
