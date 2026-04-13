import { createContext, useContext, useState } from "react";

const SideMenuContext = createContext({});

export function SideMenuProvider({ children }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    function toggleCollapse() {
        setIsCollapsed((v) => !v);
    }

    function openMobile() {
        setIsMobileOpen(true);
        setIsCollapsed(false); // always show full menu when opening on mobile
    }

    function closeMobile() {
        setIsMobileOpen(false);
    }

    return (
        <SideMenuContext.Provider value={{ isCollapsed, isMobileOpen, toggleCollapse, openMobile, closeMobile }}>
            {children}
        </SideMenuContext.Provider>
    );
}

export function useSideMenu() {
    return useContext(SideMenuContext);
}
