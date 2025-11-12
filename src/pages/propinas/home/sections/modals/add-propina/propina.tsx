import { gql } from "@apollo/client"

export const CREAR_PROPINA = gql`
    mutation CrearPropina($CreatePropinaInput: CreatePropinaInput!) {
        crear_propina(CreatePropinaInput: $CreatePropinaInput) {
            colaborador_id
            comentarios
            corte_id
            eliminado
            estado
            fecha_eliminado
            fecha_registro
            folio
            hotel_id
            procedencia
            procedencia_id
            propina_id
            total
            turno_id
        }
    }
`

export const ELIMINAR_PROPINA = gql`
    mutation Eliminar_propina($DeletePropinaInput: DeletePropinaInput!, $codigo: String!, $template_sample: String!) {
        eliminar_propina(DeletePropinaInput: $DeletePropinaInput, codigo: $codigo, template_sample: $template_sample) {
            colaborador_id
            comentarios
            corte_id
            eliminado
            estado
            fecha_eliminado
            fecha_registro
            folio
            hotel_id
            procedencia
            procedencia_id
            propina_id
            total
            turno_id
        }
    }
`
