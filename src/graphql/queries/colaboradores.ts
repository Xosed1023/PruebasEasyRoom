import { gql } from "@apollo/client"

export const GET_COLABORADORES = gql`
    query Colaboradores($hotel_id: ID) {
        colaboradores(hotel_id: $hotel_id, eliminado: false) {
            colaborador_id
            nombre
            apellido_paterno
            apellido_materno
        }
    }
`
