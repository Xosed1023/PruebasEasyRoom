import { gql } from "@apollo/client"

export const CREATE_INCIDENCE = gql`
    mutation Crear_incidencia($createIncidenciaInput: CreateIncidenciaInput!) {
        crear_incidencia(createIncidenciaInput: $createIncidenciaInput) {
            area
            incidencia_id
            severidad
            folio
            fecha_registro
        }
    }
`
