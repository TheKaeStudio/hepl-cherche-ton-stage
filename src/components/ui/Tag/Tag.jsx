import styles from "./Tag.module.scss";

export default function Tag({ icon: Icon, background, color, children }) {
    return (
        <li
            style={{
                ...(background && {
                    background: background,
                }),
                ...(color && {
                    color: color,
                    borderColor: color,
                }),
            }}
        >
            <Icon />
            <p
                style={
                    color && {
                        color: color,
                    }
                }
            >
                {children}
            </p>
        </li>
    );
}
