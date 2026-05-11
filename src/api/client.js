/**
 * Instance Axios partagée pour toutes les requêtes API.
 * - Ajoute automatiquement le Bearer token depuis localStorage.
 * - Redirige vers /login sur 401, sauf pour le rôle "limited".
 */
import axios from "axios";

const client = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: { "Content-Type": "application/json" },
});

client.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

client.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            let user = null;
            try { user = JSON.parse(localStorage.getItem("user")); } catch { /* */ }
            if (user?.role !== "limited") {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default client;
