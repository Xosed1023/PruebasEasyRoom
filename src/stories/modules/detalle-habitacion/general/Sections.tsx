export function Section({ children, title, style = {} }): JSX.Element {
    return (
        <div
            style={{
                width: "100%",
                background: "rgba(14, 14, 14, 0.80)",
                boxSizing: "border-box",
                padding: 10,
                ...style,
            }}
        >
            <div>
                <h1 style={{ color: "var(--white)", textDecoration: "underline" }}>{title}</h1>
            </div>
            {children}
        </div>
    )
}
