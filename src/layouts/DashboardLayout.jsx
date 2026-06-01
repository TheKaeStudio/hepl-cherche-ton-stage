import { useLocation, Routes, Route, Navigate } from "react-router-dom";

import { SideMenuProvider } from "../components/layout/SideMenu/SideMenuContext";
import { SavedProvider } from "../contexts/SavedContext";
import { SecteurProvider } from "../contexts/SecteurContext";
import { CompanyFieldsProvider } from "../contexts/CompanyFieldsContext";
import { useAuth } from "../contexts/AuthContext";
import SideMenu from "../components/layout/SideMenu/SideMenu";
import Main from "../components/layout/Main/Main";

import Recherche from "../pages/Recherche";
import Entreprises from "../pages/Entreprises";
import EditEntreprisePage from "../pages/EditCompanyPage";
import Utilisateurs from "../pages/Utilisateurs";
import Saved from "../pages/Saved";
import ErrorPage from "../pages/ErrorPage";

import SettingsModal from "../pages/SettingsModal";
import ProfileModal from "../pages/ProfileModal";

const modalRoutes = {
    "/parametres": <SettingsModal />,
    "/profil": <ProfileModal />,
};

export default function DashboardLayout() {
    const location = useLocation();
    const { user } = useAuth();
    const background = location.state?.background;
    const modal = modalRoutes[location.pathname];

    return (
        <SavedProvider>
        <SecteurProvider>
        <CompanyFieldsProvider>
        <SideMenuProvider>
            <SideMenu />
            <Main>
                <Routes location={background ?? location}>
                    <Route path="/" element={<Recherche />} />
                    <Route path="entreprises" element={user?.role === "limited" ? <Navigate to="/" replace /> : <Entreprises />} />
                    <Route path="entreprises/:id/modifier" element={<EditEntreprisePage />} />
                    <Route path="utilisateurs" element={<Utilisateurs />} />
                    <Route path="saved" element={<Saved />} />
                    <Route path="*" element={<ErrorPage />} />
                </Routes>
            </Main>

            {modal}
        </SideMenuProvider>
        </CompanyFieldsProvider>
        </SecteurProvider>
        </SavedProvider>
    );
}
