import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [user,  setUser]  = useState(() => {
        try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
    });

    function login(newToken, newUser) {
        localStorage.setItem("token", newToken);
        localStorage.setItem("user",  JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
    }

    function updateCurrentUser(updatedFields) {
        const merged = { ...user, ...updatedFields };
        localStorage.setItem("user", JSON.stringify(merged));
        setUser(merged);
    }

    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ token, user, login, logout, updateCurrentUser, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
