import styles from "./SearchBar.module.scss";

import SearchIcon from "@mui/icons-material/Search";

export default function SearchBar({ placeholder, value = "", onChange }) {
    return (
        <div className={styles.searchBar}>
            <SearchIcon />
            <input
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
            />
        </div>
    );
}
