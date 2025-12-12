import { gql, useQuery } from "@apollo/client"
import { useProfile } from "src/shared/hooks/useProfile"

export const GET_ROOMS = gql`
    query Habitaciones($hotel_id: ID, $estado: estados_habitaciones) {
        habitaciones(hotel_id: $hotel_id, estado: $estado) {
            habitacion_id
            numero_habitacion
            tipo_habitacion_id
            tipo_habitacion {
                nombre
            }
            ultima_renta {
                renta_id
                pagos {
                    pago_id
                    detalles_pago {
                        easyrewards_id
                    }
                }
            }
        }
    }
`

export const useRoomList = () => {
    const { hotel_id } = useProfile()
    const { data } = useQuery(GET_ROOMS, {
        variables: {
            hotel_id,
            estado: "ocupada",
        },
    })

    const occupiedRooms: any[] =
        data?.habitaciones
            ?.filter((room) => room?.ultima_renta?.renta_id)
            ?.sort((a, b) => a?.numero_habitacion - b?.numero_habitacion) || []

    return {
        occupiedRooms,
    }
}
