import { gql } from "@apollo/client"

export const GET_TURNO = gql`
    query Turno($turno_id: ID!) {
        turno(turno_id: $turno_id) {
            eliminado
            estado
            hora_entrada
            hora_salida
            hotel_id
            nombre
            turno_id
        }
    }
`
