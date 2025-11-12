import Icon from "src/shared/icons/AlertFill"
import "./index.css"

function AlertReservas({ size = 0 }): JSX.Element {
    return (
        <div className="detalle-h__alert-reservas">
            <Icon color={"var(--cancelada)"} height={14} width={14} style={{marginRight: 4}} />
            <p className="detalle-h__alert-reservas__label">{"Tienes "}<strong>{size}</strong> {` reserva${size > 1 ? "s" : ""} del día sin asignar`}</p>
        </div>
    )
}

export default AlertReservas