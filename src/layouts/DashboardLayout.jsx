import { useLocation, Routes, Route } from "react-router-dom";

import SideMenu from "../components/layout/SideMenu/SideMenu";
import Main from "../components/layout/Main/Main";

import Dashboard from "../pages/Dashboard";
import MesStages from "../pages/MesStages";
import Recherche from "../pages/Recherche";
import SettingsModal from "../pages/SettingsModal";

// Associe chaque route modale à son composant
const modalRoutes = {
    "/parametres": <SettingsModal />,
};

export default function DashboardLayout() {
    const location = useLocation();
    const background = location.state?.background;
    const modal = modalRoutes[location.pathname];

    return (
        <>
            <SideMenu />
            <Main>
                {/* Affiche la page de fond quand une modale est ouverte,
                    sinon affiche la page courante normalement */}
                <Routes location={background ?? location}>
                    <Route index element={<Dashboard />} />
                    <Route path="mon-stage" element={<MesStages />} />
                    <Route path="recherche" element={<Recherche />} />
                </Routes>
            </Main>

            {/* Modale rendue par-dessus, indépendamment du contenu */}
            {modal}
        </>
    );
}
