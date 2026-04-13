import styles from "./Toolbar.module.scss";

export default function Toolbar({
    searchBar,
    filterButton,
    sortButton,
    createButton,
}) {
    return (
        <div className={styles.toolbar}>
            {searchBar}
            {(sortButton || filterButton || createButton) && (
                <div>
                    {sortButton}
                    {filterButton}
                    {createButton}
                </div>
            )}
        </div>
    );
}
