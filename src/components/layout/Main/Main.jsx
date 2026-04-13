import styles from "./Main.module.scss"
import StatusBar from "@components/layout/StatusBar/StatusBar"

export default function Main({ children }) {
    return (
        <main>
            <StatusBar />
            <div>
                {children}
            </div>
        </main>
    )
}