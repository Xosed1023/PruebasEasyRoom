import { gql } from "@apollo/client"

export const GET_TURNOS = gql`
    query Turnos($hotel_id: [ID!]!) {
        turnos(hotel_id: $hotel_id) {
            nombre
            turno_id
            hora_entrada
        }
    }
`
