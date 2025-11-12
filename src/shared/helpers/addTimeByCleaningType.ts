import { TiposLimpiezas } from "src/gql/schema"
import { useDate } from "../hooks/useDate"

export const addTimeByCleaningType = ({
    date,
    cleaningType,
    tiempoLimpiezaDetallada,
    tiempoLimpiezaNormal,
    tiempoLimpiezaRetoque,
}: {
    date: string
    cleaningType: TiposLimpiezas
    tiempoLimpiezaDetallada?: number
    tiempoLimpiezaNormal?: number
    tiempoLimpiezaRetoque?: number
}) => {
    const { UTCStringToLocalDate, localDateToUTCString } = useDate()
    const manipulableDate = UTCStringToLocalDate(date)

    if (!isNaN(manipulableDate.getTime())) {
        if (cleaningType === TiposLimpiezas.Detallada) {
            return localDateToUTCString(
                new Date(manipulableDate.setMinutes(manipulableDate.getMinutes() + (tiempoLimpiezaDetallada || 0)))
            )
        }
        if (cleaningType === TiposLimpiezas.Normal) {
            return localDateToUTCString(
                new Date(manipulableDate.setMinutes(manipulableDate.getMinutes() + (tiempoLimpiezaNormal || 0)))
            )
        }
        if (cleaningType === TiposLimpiezas.Retoque) {
            return localDateToUTCString(
                new Date(manipulableDate.setMinutes(manipulableDate.getMinutes() + (tiempoLimpiezaRetoque || 0)))
            )
        }
    }
}
