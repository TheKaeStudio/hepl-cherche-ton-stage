import { createBrowserRouter } from "react-router-dom";

import ProtectedRoute from "./layouts/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Activate from "./pages/auth/Activate";
import VerifyEmail from "./pages/auth/VerifyEmail";
import ErrorPage from "./pages/ErrorPage";
import RouteErrorPage from "./pages/RouteErrorPage";

const router = createBrowserRouter([
    {
        element: <ProtectedRoute />,
        errorElement: <RouteErrorPage />,
        children: [
            { path: "/*", element: <DashboardLayout /> },
        ],
    },
    {
        element: <AuthLayout />,
        errorElement: <RouteErrorPage />,
        children: [
            { path: "/login",        element: <Login /> },
            { path: "/signup",       element: <Signup /> },
            { path: "/verify-email", element: <VerifyEmail /> },
        ],
    },
    { path: "/activate/:token", element: <Activate />, errorElement: <RouteErrorPage /> },
    { path: "*", element: <ErrorPage /> },
]);

export default router;
