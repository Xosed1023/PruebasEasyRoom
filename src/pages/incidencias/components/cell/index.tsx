import cx from "classnames"
import "./index.css"
import { BuildCell } from "../../helpers/build-cell"

export const CellUrgencia = ({ urgencia = "" }) => {
    return (
        <div className="incidencias-cell__urgencia">
            <div
                className={cx({
                    "incidencias-cell__text-urgencia": true,
                    "incidencias-cell--baja": urgencia === "Baja",
                    "incidencias-cell--media": urgencia === "Media",
                    "incidencias-cell--alta": urgencia === "Alta",
                })}
                style={{fontSize: 10}}
            >
                {urgencia}
            </div>
        </div>
    )
}

export const CellEstado = ({ estado = "" }) => {
    return (
        <div className="incidencias-cell__estado">
            <span className="incidencias-cell__estado-label">
                <BuildCell txt={estado} />
            </span>
            {estado === "Activa" && <span className="incidencias-cell__estado-dot" role={"figure"} />}
        </div>
    )
}

export const CellTipo = ({ text = "" }) => {
    const list = text?.split("/")

    return (
        <div className="incidencias__cell-tipo">
            <span className="incidencias__cell-tipo-title">{<BuildCell txt={list?.[0] || ""} />}</span>
            {list?.[1] && <BuildCell txt={list?.[1] || ""} />}
        </div>
    )
}
