import { useNavigate } from "react-router-dom"
import "../empty-state/Empty.css"
import { Button } from "src/shared/components/forms"

function Expiration(): JSX.Element {
    const navigate = useNavigate()

    return (
        <div className="expiration-screen">
            <img
                className="expiration-screen_logo"
                src={require("src/assets/png/logo_md.png")}
                width={269}
                height={48}
                alt="logo"
            />
            <div className="expiration-screen_content">
                <div className="expiration-screen_left">
                    <p className="expiration-screen_title">Lo sentimos, el enlace ha expirado</p>
                    <p className="expiration-screen_subtitle">
                        El enlace ha caducado. Puedes encontrar la información que buscas en nuestra página de inicio{" "}
                        <span className="expiration-screen_link" onClick={() => navigate("/")}>
                            easyroom.io
                        </span>{" "}
                        o contactarnos a través de redes sociales.
                    </p>
                    <Button className="expiration-screen__button" text="Crear cuenta" onClick={() => navigate("/auth/registry")}/>
                </div>
                <div className="empty-state-screen_right">
                    <img
                        className="empty-state-screen_img"
                        src={require("src/assets/png/expiration.png")}
                        alt="logo"
                        width={506}
                        height={285}
                    />
                </div>
            </div>
        </div>
    )
}

export default Expiration
