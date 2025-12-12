import "./Registry.css"
import "../login/Login.css"
import { Button } from "src/shared/components/forms"
import { useLocation, useNavigate } from "react-router-dom"
import Icon from "src/shared/icons"

const getParams = (params: any) => {
    return {
        email: params?.email || "",
    }
}

function Verification(): JSX.Element {
    const navigate = useNavigate()
    const location = useLocation()
    const { email } = getParams(location.state)

    return (
        <div className="registry-screen">
            <div className="verification-screen_content">
                <div className="verification-screen_header">
                    <Icon name="mailFill" color="#6941C6" width={60} height={60} />
                </div>
                <p className="registry-screen_title">Verifica tu correo</p>
                <p className="verification-screen_text">
                    Hemos enviado un enlace de verificación a tu correo electrónico{" "}
                    <span className="verification-screen_email">{email}</span> para que verifiques tu cuenta. Si no
                    recibes nada, revisa tu carpeta de spam o correo no deseado.
                </p>
                <Button
                    className="verification-screen_button"
                    theme="primary"
                    text="Ir a inicio de sesión"
                    onClick={() => navigate("/")}
                />
            </div>
        </div>
    )
}

export default Verification
