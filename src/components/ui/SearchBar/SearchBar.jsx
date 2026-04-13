import styles from "./SearchBar.module.scss";

import SearchIcon from "@mui/icons-material/Search";

export default function SearchBar({ placeholder }) {
    return (
        <div className={styles.searchBar}>
            <SearchIcon />
            <input placeholder={placeholder} />
        </div>
    );
}
