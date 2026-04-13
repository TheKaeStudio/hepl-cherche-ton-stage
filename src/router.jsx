import { createBrowserRouter } from "react-router-dom";

import ProtectedRoute from "./layouts/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";

const router = createBrowserRouter([
    {
        element: <ProtectedRoute />,
        children: [
            // DashboardLayout gère lui-même ses routes internes
            { path: "/*", element: <DashboardLayout /> },
        ],
    },
    // Routes publiques (hors dashboard)
    // { path: "/login", element: <Login /> },
]);

export default router;
