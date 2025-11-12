import { EstadoPagoOrdenes } from "src/gql/schema"
import { estadosOrdenes } from "../../Ordenes.constants"
import { getEstadoOrden } from "../en-servicio"
import "./StatusOrdenCell.css"

export const StatusOrdenPagoCell = ({
    text,
    statusOrdenPago,
    statusOrden,
}: {
    text: string
    statusOrdenPago: EstadoPagoOrdenes
    statusOrden
}) => {
    return (
        <span
            className={`orden-cell-pago${
                statusOrdenPago === "no_pagada" && statusOrden !== "cancelada" ? " orden-cell-pago__pendiente" : ""
            }`}
        >
            {text}
        </span>
    )
}

export const StatusOrdenCell = ({ value = "", origen = "" }) => {
    const estado = getEstadoOrden(origen, value)
    return (
        <span className={`orden-cell__status orden-cell__status__${estado}`}>{estadosOrdenes?.[estado] || "N/A"}</span>
    )
}
