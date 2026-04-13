import { Navigate, Outlet } from "react-router-dom";

function useAuth() {
    // TODO: remplacer par la vraie logique d'authentification
    const user = true;
    return { user };
}

export default function ProtectedRoute() {
    const { user } = useAuth();
    return user ? <Outlet /> : <Navigate to="/login" replace />;
}
