import { Maybe } from "graphql/jsutils/Maybe"
import { useEffect, useState } from "react"
import { EstadosRentas, UltimosConceptosPendientesDetailOutput } from "src/gql/schema"
import isTimeout from "../helpers/isTimeout"
import { useDate } from "src/shared/hooks/useDate"

const useIsTimeout = ({
    ultimos_conceptos_pendientes,
    occupiedTimeEndCondensada,
    roomServiceTimeEnd,
    lastRentStatus,
    now,
}: {
    ultimos_conceptos_pendientes: Maybe<UltimosConceptosPendientesDetailOutput>
    roomServiceTimeEnd: string
    occupiedTimeEndCondensada: string
    lastRentStatus: EstadosRentas
    now: Date
}) => {
    const [timeoutDate, settimeoutDate] = useState<string | null>(null)

    const {UTCStringToLocalDate} = useDate()

    const expDate = (): { type: "orden" | "extra"; date: string } | null => {
        if (ultimos_conceptos_pendientes?.orden) {
            return {
                type: "orden",
                date: ultimos_conceptos_pendientes.orden.fecha_registro,
            }
        }
        if (ultimos_conceptos_pendientes?.extra && ultimos_conceptos_pendientes.renta) {
            const fechaExtra = ultimos_conceptos_pendientes?.extra?.fecha_solicitud
            const fehcaRenta = ultimos_conceptos_pendientes?.renta?.fecha_registro
            if(!fechaExtra && !fehcaRenta) {
                return null
            }
            if(fechaExtra && !fehcaRenta) {
                return {
                    date: fechaExtra,
                    type: "extra",
                }
            }
            if(!fechaExtra && fehcaRenta) {
                return {
                    date: fehcaRenta,
                    type: "extra",
                }
            }
            return UTCStringToLocalDate(fechaExtra).getDate() < UTCStringToLocalDate(fehcaRenta).getDate()
                ? {
                    date: fechaExtra,
                    type: "extra",
                }
                : {
                    date: fehcaRenta,
                    type: "extra",
                }
        }
        if (ultimos_conceptos_pendientes?.extra) {
            return {
                date: ultimos_conceptos_pendientes?.extra?.fecha_solicitud,
                type: "extra",
            }
        }
        if (ultimos_conceptos_pendientes?.renta) {
            return {
                date: ultimos_conceptos_pendientes?.renta?.fecha_registro,
                type: "extra",
            }
        }
        if (
            !ultimos_conceptos_pendientes?.orden &&
            !ultimos_conceptos_pendientes?.extra &&
            !ultimos_conceptos_pendientes?.renta
        ) {
            return null
        }
        return null
    }

    useEffect(() => {
        const dateValues = expDate()
        if (
            (!!roomServiceTimeEnd &&
                isTimeout({
                    date: occupiedTimeEndCondensada,
                    now,
                })) ||
            isTimeout({
                date: occupiedTimeEndCondensada,
                now,
            })
        ) {
            return settimeoutDate(dateValues?.date || null)
        }
        if (!dateValues) {
            settimeoutDate(null)
            return
        }
        settimeoutDate(dateValues.date)
        if (dateValues.type === "orden") {
            isTimeout({
                date: dateValues.date,
                now,
                minutes: 60,
            })
            return
        }
        if (dateValues.type === "extra" && lastRentStatus === EstadosRentas.PendientePago) {
            isTimeout({
                date: dateValues.date || "",
                now,
                minutes: 20,
            })
            return
        }
        settimeoutDate(null)
    }, [now, occupiedTimeEndCondensada, roomServiceTimeEnd, ultimos_conceptos_pendientes, lastRentStatus])

    return { timeoutDate }
}

export default useIsTimeout
