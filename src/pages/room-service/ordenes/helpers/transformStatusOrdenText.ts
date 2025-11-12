import { EstadoPagoOrdenes, EstadosOrdenHistorial } from "src/gql/schema"

export const transformStatusOrdenText = ({
    statusOrdenPago,
    statusOrden,
}: {
    statusOrdenPago: EstadoPagoOrdenes
    statusOrden
}) => {
    if (statusOrden === EstadosOrdenHistorial.Cancelada) {
        return "Cancelada"
    }
    if (statusOrdenPago === EstadoPagoOrdenes.Pagada) {
        return "Pagada"
    }
    if (statusOrdenPago === EstadoPagoOrdenes.NoPagada) {
        return "Pendiente"
    }
    return "Pagada"
}
