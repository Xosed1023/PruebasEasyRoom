import { gql } from "@apollo/client"

export const ASIGNAR_HABITACION_A_RESERVA = gql`
    mutation AsignarHabitacionAReserva($datos_reserva: AddRoomToBookingInput!) {
        asignar_habitacion_a_reserva(datos_reserva: $datos_reserva) {
            habitacion_id
        }
    }
`

export const GET_COMENTARIOS_RESERVA = gql`
    query GetReservacionesCalendar($id: [ID!]!) {
        reservas(reserva_id: $id) {
            comentarios {
                comentario
            }
        }
    }
`

export const AGREGAR_COMENTARIO_RESERVA = gql`
    mutation AgregarComentarioReserva($agregar_comentario_reserva: AddComentarioReservaInput!) {
        agregar_comentario_reserva(AddComentarioReservaInput: $agregar_comentario_reserva)
    }
`
