import Icon from "src/shared/icons/AlertFill"
import "./index.css"

function AlertListaEspera({ size = 0 }): JSX.Element {
    return (
        <div className="detalle-h__alert-lista-espera">
            <Icon color={"var(--cancelada)"} height={14} width={14} style={{ marginRight: 4 }} />
            <p className="detalle-h__alert-lista-espera__label">
                {"Tienes "}
                <strong>{size}</strong> {` huésped${size > 1 ? "es" : ""} en espera de esta habitación`}
            </p>
        </div>
    )
}

export default AlertListaEspera
