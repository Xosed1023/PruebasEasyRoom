import { Maybe, UltimosConceptosPendientesDetailOutput } from "src/gql/schema"
import { createDateUtils } from "src/shared/hooks/useDate"

const getFirstConceptoPendiente = (ultimos_conceptos_pendientes?: Maybe<UltimosConceptosPendientesDetailOutput>) => {
    const { UTCStringToLocalDate } = createDateUtils()

    const extra = { type: "extra", date: ultimos_conceptos_pendientes?.extra?.fecha_solicitud }
    const orden = { type: "orden", date: ultimos_conceptos_pendientes?.orden?.fecha_registro }
    const renta = { type: "renta", date: ultimos_conceptos_pendientes?.renta?.fecha_registro }

    const list = [extra, orden, renta].filter((i) => i.date)

    const older = list.length > 0 ? list.reduce((min, item) =>
        UTCStringToLocalDate(item.date) < UTCStringToLocalDate(min.date) ? item : min
    ) : null

    return {
        ...(list.length
            ? {
                older: {
                    type: older?.type as "extra" | "renta" | "orden",
                    date: UTCStringToLocalDate(older?.date),
                },
            }
            : { older: null }),
    }
}

export default getFirstConceptoPendiente
