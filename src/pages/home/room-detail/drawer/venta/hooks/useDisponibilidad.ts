import { gql, useQuery } from "@apollo/client"
import { useProfile } from "src/shared/hooks/useProfile"
import { useRoom } from "../../../hooks"

export const QUERY = gql`
    query Disponibilidad_habitacion($hotel_id: ID!, $tipo_habitacion_id: ID!) {
        disponibilidad_habitacion(hotel_id: $hotel_id, tipo_habitacion_id: $tipo_habitacion_id) {
            alerta_por_disponibilidad
            alerta_por_turnos_atencion
            reservas_del_dia
            turnos_en_espera
        }
    }
`

export function useDisponibilidadHabitacion() {
    const { hotel_id } = useProfile()
    const room = useRoom()
    const { data } = useQuery(QUERY, {
        variables: {
            hotel_id,
            tipo_habitacion_id: room?.tipo_habitacion?.tipo_habitacion_id,
        },
    })

    const res = data?.disponibilidad_habitacion

    return {
        alerta_por_disponibilidad: res?.alerta_por_disponibilidad,
        alerta_por_turnos_atencion: res?.alerta_por_turnos_atencion,
        reservas_del_dia: Number(res?.reservas_del_dia || 0),
        turnos_en_espera: Number(res?.turnos_en_espera || 0),
    }
}
