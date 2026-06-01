import styles from "./Main.module.scss"
import StatusBar from "@components/layout/StatusBar/StatusBar"
import { useSideMenu } from "@components/layout/SideMenu/SideMenuContext"

export default function Main({ children }) {
    const { isCollapsed } = useSideMenu();
    return (
        <main className={`${styles.main} ${isCollapsed ? styles.collapsed : ""}`}>
            <StatusBar />
            <div>
                {children}
            </div>
        </main>
    )
}