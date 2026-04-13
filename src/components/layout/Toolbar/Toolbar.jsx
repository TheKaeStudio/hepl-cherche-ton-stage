import styles from "./Toolbar.module.scss";

export default function Toolbar({
    searchBar,
    filterButton,
    sortButton,
    createButton,
}) {
    return (
        <div className={styles.toolbar}>
            {searchBar && (
                <div className={styles.searchWrap}>
                    {searchBar}
                </div>
            )}
            {(sortButton || filterButton || createButton) && (
                <div className={styles.actions}>
                    {sortButton}
                    {filterButton}
                    {createButton}
                </div>
            )}
        </div>
    );
}
