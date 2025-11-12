import { Link, useNavigate } from "react-router-dom"
import { Button } from "src/shared/components/forms/button/Button"
import "./Empty.css"

function EmptyPassword(): JSX.Element {
    const navigate = useNavigate()
    return (
        <section className="empty-password">
            <div className="empty-password__logo">
                <img src={require("src/assets/png/logo_md.png")} height={48} alt="logo" />
            </div>
            <div className="empty-password__card">
                <div className="empty-password__info">
                    <h1 className="empty-password__title">{"Lo sentimos, el enlace  ha expirado"}</h1>
                    <p className="empty-password__text">
                        El enlace ha caducado. Puedes encontrar la información que buscas en nuestra página de inicio
                        <Link className="empty-password__link" to={"/"} replace>
                            {"easyroom.io"}
                        </Link>
                        o contactarnos a través de redes sociales.
                    </p>
                    <Button
                        className="empty-password__button"
                        text="Ir a Inicio de sesión"
                        onClick={() => navigate("/", { replace: true })}
                    />
                </div>
                <div className="empty-password__cover">
                    <img src={require("src/assets/png/error404.png")} width={"100%"} alt="logo" />
                </div>
            </div>
        </section>
    )
}

export default EmptyPassword
