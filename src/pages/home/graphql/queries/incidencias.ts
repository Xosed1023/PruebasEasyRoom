import { gql } from "@apollo/client"

export const GET_INCIDENCIAS_ROOM = gql`
    query GetIncidencias($habitacion_id: ID!) {
        incidencias(habitacion_id: $habitacion_id) {
            incidencia_id
            area
            folio
            fecha_registro
            estado
            colaborador_id_reporta
            colaborador_reporta {
                nombre
                apellido_materno
                apellido_paterno
                puesto {
                    nombre
                }
            }
            detalle
            habitacion_id
        }
    }
`
