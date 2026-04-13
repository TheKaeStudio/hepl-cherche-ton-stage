import styles from "./Recherche.module.scss";

import SearchBar from "../components/ui/SearchBar/SearchBar";
import Toolbar from "../components/layout/Toolbar/Toolbar";
import ActionButton from "../components/ui/ActionButton/ActionButton";
import CompanyCard from "@/components/company/CompanyCard/CompanyCard";

import SortIcon from "@mui/icons-material/ImportExport";
import FilterIcon from "@mui/icons-material/FilterList";
import PlusIcon from "@mui/icons-material/Add";

export default function Recherche() {
    return (
        <section>
            <div className="sectionHeader">
                <h2>Rechercher un stage</h2>
                <p>Explorer et trouver le stage qui vous convient le mieux.</p>
            </div>
            <Toolbar
                searchBar={
                    <SearchBar placeholder="Rechercher une entreprise..." />
                }
                sortButton={
                    <ActionButton icon={SortIcon}>
                        Les plus consultés
                    </ActionButton>
                }
                filterButton={
                    <ActionButton icon={FilterIcon}>Filtres</ActionButton>
                }
                createButton={
                    <ActionButton icon={PlusIcon} filled>
                        Créer un message
                    </ActionButton>
                }
            />
            <div className={styles.companyList}>
                <CompanyCard>EVS Broadcast Equipment</CompanyCard>
            </div>
        </section>
    );
}
