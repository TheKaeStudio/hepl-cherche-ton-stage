import { useLocation, Routes, Route, Navigate } from "react-router-dom";

import { SideMenuProvider } from "../components/layout/SideMenu/SideMenuContext";
import { SavedProvider } from "../contexts/SavedContext";
import SideMenu from "../components/layout/SideMenu/SideMenu";
import Main from "../components/layout/Main/Main";

import Dashboard from "../pages/Dashboard";
import MesStages from "../pages/MesStages";
import Recherche from "../pages/Recherche";
import Stages from "../pages/Stages";
import Etudiants from "../pages/Etudiants";
import Entreprises from "../pages/Entreprises";
import Utilisateurs from "../pages/Utilisateurs";
import Inbox from "../pages/Inbox";
import Saved from "../pages/Saved";
import Support from "../pages/Support";
import ErrorPage from "../pages/ErrorPage";

import SettingsModal from "../pages/SettingsModal";
import ProfileModal from "../pages/ProfileModal";
import NotificationsModal from "../pages/NotificationsModal";

const modalRoutes = {
    "/parametres": <SettingsModal />,
    "/profil": <ProfileModal />,
    "/notifications": <NotificationsModal />,
};

export default function DashboardLayout() {
    const location = useLocation();
    const background = location.state?.background;
    const modal = modalRoutes[location.pathname];

    return (
        <SavedProvider>
        <SideMenuProvider>
            <SideMenu />
            <Main>
                <Routes location={background ?? location}>
                    <Route index element={<Dashboard />} />
                    <Route path="mon-stage" element={<MesStages />} />
                    <Route path="recherche" element={<Recherche />} />
                    <Route path="stages" element={<Stages />} />
                    <Route path="etudiants" element={<Etudiants />} />
                    <Route path="entreprises" element={<Entreprises />} />
                    <Route path="utilisateurs" element={<Utilisateurs />} />
                    <Route path="inbox" element={<Inbox />} />
                    <Route path="saved" element={<Saved />} />
                    <Route path="support" element={<Support />} />
                    <Route path="mon-dossier" element={<Navigate to="/mon-stage" replace />} />
                    <Route path="*" element={<ErrorPage />} />
                </Routes>
            </Main>

            {modal}
        </SideMenuProvider>
        </SavedProvider>
    );
}
