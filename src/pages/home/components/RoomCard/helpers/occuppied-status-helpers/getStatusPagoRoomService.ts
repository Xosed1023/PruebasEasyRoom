import { EstadoPagoOrdenes } from "src/gql/schema"
import isTimeout from "../isTimeout"
import { StatusPagoTypes } from "./status.type"

const getStatusPagoRoomService = ({
    fecha_registro_ultima_orden,
    now,
    estado_pago,
}: {
    fecha_registro_ultima_orden?: string
    now: Date
    estado_pago?: EstadoPagoOrdenes
}) => {
    if (!fecha_registro_ultima_orden || !estado_pago) {
        return StatusPagoTypes.NA
    }

    if (estado_pago === EstadoPagoOrdenes.Pagada) {
        return StatusPagoTypes.Pagada
    }

    if ([EstadoPagoOrdenes.Pagada, EstadoPagoOrdenes.Deposito].includes(estado_pago)) {
        return StatusPagoTypes.Pagada
    }

    return isTimeout({
        date: fecha_registro_ultima_orden,
        now,
        minutes: 60,
    })
        ? StatusPagoTypes.Expirada
        : StatusPagoTypes.NoExpirada
}

export default getStatusPagoRoomService
