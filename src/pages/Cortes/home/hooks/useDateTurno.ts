import { useMemo } from "react"
import { gql, useQuery } from "@apollo/client"
import { useTurnoActual } from "src/pages/home/room-detail/hooks/turnos"
import { useProfile } from "src/shared/hooks/useProfile"
import { useCurrentDateQuery } from "src/gql/schema"
//import { getExactDate } from "src/utils/date"

export const GET_ULTIMO_CORTE = gql`
    query Ultimo_corte($hotel_id: ID!) {
        ultimo_corte(hotel_id: $hotel_id) {
            corte_id
            fecha_fin_corte
            fecha_inicio_corte
        }
    }
`

export const getDate = (hour: string): Date => {
    const date = new Date()
    const hourList = hour?.split(":")

    const format = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        Number(hourList?.[0] || 0),
        Number(hourList?.[1] || 0),
        0,
        0
    )

    return !isNaN(format.getTime()) ? format : new Date()
}

export function useDateTurno() {
    const { hotel_id } = useProfile()
    const turno = useTurnoActual()
    const { data: currentDate } = useCurrentDateQuery()

    const { data, loading: load } = useQuery(GET_ULTIMO_CORTE, {
        variables: {
            hotel_id,
        },
    })

    const params = useMemo(() => {
        return {
            startDate: !load ? (data?.ultimo_corte?.fecha_fin_corte ? data?.ultimo_corte?.fecha_fin_corte : "") : "",
            endDate: currentDate ? currentDate.serverDate : "",
            turno_id: turno?.turno_id || "",
            hora_entrada: turno?.hora_entrada || "",
            hora_salida: turno?.hora_salida || "",
            nombre: turno?.nombre || "",
            ultimo_corte: data?.ultimo_corte?.fecha_fin_corte || "",
            loading: load,
        }
    }, [turno, data, load, currentDate])

    return params
}
