import { TiposExtras } from "src/gql/schema"
import { StatusPagoTypes } from "./status.type"
import isTimeout from "../isTimeout"

const getStatusPagoPendientePersonaExtra = ({
    fecha_solicitud,
    now,
    tipo_extra,
}: {
    fecha_solicitud?: string
    now: Date
    tipo_extra?: TiposExtras
}) => {
    if (!fecha_solicitud || tipo_extra !== TiposExtras.Persona) {
        return StatusPagoTypes.NA
    }

    return isTimeout({
        date: fecha_solicitud,
        now,
        minutes: 20,
    })
        ? StatusPagoTypes.Expirada
        : StatusPagoTypes.NoExpirada
}

export default getStatusPagoPendientePersonaExtra
