import { Maybe } from "graphql/jsutils/Maybe"
import { UltimosConceptosPendientesDetailOutput } from "src/gql/schema"
import isTimeout from "../isTimeout"
import { StatusPagoTypes } from "./status.type"

export const getStatusPagoPendienteRenta = ({
    ultimos_conceptos_pendientes,
    now,
}: {
    ultimos_conceptos_pendientes: Maybe<UltimosConceptosPendientesDetailOutput>
    now: Date
}): StatusPagoTypes.Expirada | StatusPagoTypes.NoExpirada | StatusPagoTypes.Pagada => {
    if (!ultimos_conceptos_pendientes || !ultimos_conceptos_pendientes.renta) {
        return StatusPagoTypes.Pagada
    }
    if(
        isTimeout({
            date: ultimos_conceptos_pendientes?.renta?.fecha_registro || "",
            now,
            minutes: 20,
        })
    ) {
        return StatusPagoTypes.Expirada
    }
    return StatusPagoTypes.NoExpirada
}