import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Screen from "src/shared/components/layout/screen/Screen"
import BoxOption from "src/shared/components/forms/box-option/BoxOption"
import { PrimaryButton } from "src/pages/home/room-detail/sections/elements/Elements"
import "./ConfirmarCorte.css"

const ConfirmarCorte = ({ onConfirm }) => {
    const navigate = useNavigate()
    const [incidence, setIncidence] = useState<string>("Sin")

    const submit = () => {
        if (incidence === "Sin") {
            onConfirm()
        } else {
            navigate("/u/cortes/crear-incidencia")
        }
    }

    return (
        <Screen close={true} title="" back className="confirmar-corte-container">
            <div className="end-checkout__content">
                <span className="end-checkout__title">
                    Antes de cerrar el turno ¿Tienes alguna incidencia que reportar?
                </span>
                <div className="end-checkout__options">
                    <div className="end-checkout__options-item">
                        <BoxOption
                            active={incidence === "Sin"}
                            className=""
                            icon="emotionHappy"
                            label="Sin incidencias"
                            onClick={() => {
                                setIncidence("Sin")
                            }}
                            style={{
                                height: 192,
                                width: 300,
                            }}
                        />
                    </div>
                    <div className="end-checkout__options-item">
                        <BoxOption
                            active={incidence === "Registar"}
                            className=""
                            icon="emotionUnhappy"
                            label="Registar incidencia"
                            onClick={() => {
                                setIncidence("Registar")
                            }}
                            style={{
                                height: 192,
                                width: 300,
                            }}
                        />
                    </div>
                </div>
                <PrimaryButton className="end-checkout__confirm-button" text={"Continuar"} onClick={submit} />
            </div>
        </Screen>
    )
}

export default ConfirmarCorte
