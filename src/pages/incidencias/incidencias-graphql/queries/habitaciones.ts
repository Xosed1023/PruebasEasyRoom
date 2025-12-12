import { gql } from "@apollo/client"

export const GET_HABITACIONES = gql`
    query Habitaciones {
        habitaciones {
            habitacion_id
            hotel_id
            tipo_habitacion_id
            numero_habitacion
            estado
            tipo_habitacion {
                tipo_habitacion_id
                nombre
            }
        }
    }
`
