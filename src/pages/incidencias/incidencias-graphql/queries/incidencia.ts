import { gql } from "@apollo/client"

export const GET_COMENTARIOS_INCIDENCIA = gql`
    query Incidencia($incidencia_id: ID!) {
        incidencias(incidencia_id: $incidencia_id) {
            incidencia_id
            estado
            comentarios {
                fecha
                comentario
            }
        }
    }
`
