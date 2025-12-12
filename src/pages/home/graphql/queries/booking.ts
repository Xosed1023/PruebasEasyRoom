import { gql } from "@apollo/client"

export const ROOM_RESERVAS = gql`
    query Reservas(
        $id: [ID!]!
        $usuario_id: ID
        $tipo_habitacion_id: ID
        $hotel_id: ID
        $datos_busqueda: DateSearchInput
    ) {
        reservas(
            reserva_id: $id
            usuario_id: $usuario_id
            tipo_habitacion_id: $tipo_habitacion_id
            hotel_id: $hotel_id
            fecha_entrada: $datos_busqueda
        ) {
            folio
            habitacion_id
            nombre_huesped
            reserva_id
            estado
            fecha_entrada
        }
    }
`
