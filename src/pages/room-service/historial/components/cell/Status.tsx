import { EstadoPagoOrdenes, EstadosOrdenHistorial } from "src/gql/schema"
import { capitalize } from "src/shared/helpers/capitalize"

function Status({ statusOrden, statusOrdenPago }): JSX.Element {
    const type =
        statusOrdenPago === EstadoPagoOrdenes.Pagada && statusOrden !== EstadosOrdenHistorial.Cancelada
            ? "pagada"
            : statusOrdenPago === EstadoPagoOrdenes.NoPagada && statusOrden !== EstadosOrdenHistorial.Cancelada
            ? "pendiente"
            : "cancelada"

    return <span className={`historial-rs__cell-status historial-rs__cell-${type}`}>{capitalize(type)}</span>
}

export default Status
