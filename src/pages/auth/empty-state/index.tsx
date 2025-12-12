import "./Empty.css"

function EmptyState(): JSX.Element {
    return (
        <div className="empty-state-screen">
            <div className="empty-state-screen_left">
                <p className="empty-state-screen_title">Te damos la bienvenida a </p>
                <img
                    className="empty-state-screen_logo"
                    src={require("src/assets/png/logo_md.png")}
                    width={446}
                    height={78}
                    alt="logo"
                />
                <p className="empty-state-screen_subtitle">
                    Obtén acceso completo a todas las increíbles funcionalidades de <span style={{ color: "#6941C6"}}>easyroom</span> y haz que la
                    gestión de tu establecimiento sea más fácil y eficiente con nuestra licencia personalizada.
                </p>
            </div>
            <div className="empty-state-screen_right">
                <img
                    className="empty-state-screen_img"
                    src={require("src/assets/png/empty-state.png")}
                    alt="logo"
                    width={591}
                    height={498}
                />
            </div>
        </div>
    )
}

export default EmptyState
