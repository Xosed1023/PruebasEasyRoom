import { useEffect } from "react"
import { UseFormReset } from "react-hook-form"
import { useLocation } from "react-router-dom"
import { useTurnoActual } from "src/pages/home/room-detail/hooks/turnos"
import { FormValues } from "./RegistroIncidencia.types"
import { defaultValues } from "./RegistroIncidencia.constants"
import { useCurrentDateLazyQuery } from "src/gql/schema"
import { useDate } from "src/shared/hooks/useDate"

export function useRegistroIncienciaConfig(turnos: any[], reset: UseFormReset<FormValues>) {
    const turno = useTurnoActual()
    const location = useLocation()
    const [getDate] = useCurrentDateLazyQuery()
    const { UTCStringToLocalDate } = useDate()

    const fromCortes = location.pathname === "/u/cortes/crear-incidencia"

    useEffect(() => {
        if (turno?.turno_id && fromCortes) {
            getDate().then((d) => {
                reset({
                    ...defaultValues,
                    turn: turno?.turno_id,
                    date: [UTCStringToLocalDate(d.data?.serverDate)],
                })
            })
        }
    }, [turno?.turno_id])

    const getRegisterDate = (prevDate: Date, turnoId: string): Promise<string> => {
        return getDate().then((d) => {
            const date = new Date(UTCStringToLocalDate(d.data?.serverDate))
            date.setFullYear(prevDate.getFullYear())
            date.setMonth(prevDate.getMonth())
            date.setDate(prevDate.getDate())

            const findTurno = turnos?.find(({ turno_id }) => turno_id === turnoId)

            if (findTurno) {
                const current = new Date(d.data?.serverDate)
                const timeList = findTurno?.hora_entrada?.split(":")
                const hour = Number(timeList?.[0]) || 0

                if (date.getDate() !== current.getDate() || findTurno?.turno_id !== turno?.turno_id) {
                    date.setHours(hour)
                    date.setMinutes(0)
                    date.setSeconds(0)
                    date.setMilliseconds(0)
                }
            }

            return date.toISOString()
        })
    }

    return {
        fromCortes,
        getRegisterDate,
    }
}
