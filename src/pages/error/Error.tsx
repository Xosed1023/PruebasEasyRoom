import { Button } from "src/shared/components/forms"
import "./Error.css"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Easyroom from "./svg/Easyroom"
import Field from "./svg/Field"
import Wires from "./svg/Wires"

export interface Props {
    code: number
}
const Error = (props: Props) => {
    // type: 404 - 500
    const [type] = useState(props.code)
    const navigate = useNavigate()

    return (
        <div className="error-screen-container">
            <div className="error-screen-logo">
                <Easyroom />
            </div>
            <div className="error-screen-info-container">
                <div className="error-screen-info">
                    <p className="error-text-type">Error {type}</p>
                    <p className="error-text-title">{type === 404 ? "Página no encontrada" : "¡Oops! sin conexión"}</p>
                    <span className="error-text-subtitle">
                        {type === 404
                            ? "La página que intentas acceder no está disponible en este momento. Por favor, verifica la URL ingresa a"
                            : "Revisa tu conexión a internet y, una vez solucionado, intentar recargar la página."}
                    </span>
                    {type === 404 && (
                        <a href="https://easyroom.io">
                            <span className="error-text-link">easyroom.io</span>
                        </a>
                    )}
                    {type === 404 && <span className="error-text-subtitle">o vuelve a intentarlo más tarde.</span>}
                    <Button
                        onClick={() => (type === 404 ? navigate("/u") : navigate(0))}
                        text={type === 404 ? "Ir al Home" : "Volver a cargar"}
                        className="error-screen-button"
                    />
                </div>
                {type === 404 || type === 400 ? <Field /> : <Wires />}
            </div>
        </div>
    )
}

export default Error
