import { gql } from "@apollo/client"

export const CREAR_INCIDENCIA = gql`
    mutation Crear_incidencia($createIncidenciaInput: CreateIncidenciaInput!) {
        crear_incidencia(createIncidenciaInput: $createIncidenciaInput) {
            incidencia_id
            folio
        }
    }
`
export const AGREGAR_COMENTARIO = gql`
    mutation Agregar_comentario($addComentarioInput: AddComentarioIncidenciaInput!) {
        agregar_comentario(addComentarioInput: $addComentarioInput)
    }
`
export const CERRAR_INCIDENCIA = gql`
    mutation CerrarIncidencia($closeIncidenciaInput: CloseIncidenciaInput!) {
        cerrar_incidencia(closeIncidenciaInput: $closeIncidenciaInput) {
            incidencia_id
            severidad
            area
            detalle
            colaborador_id_reporta
            turno_id
            habitacion_id
            colaborador_id_cierra
            fecha_cierre
            fecha_registro
            folio
        }
    }
`
export const REMOVER_RESERVA_HABITACION = gql`
    mutation Remover_reserva_de_habitacion($remover_data: RemoveBookingFromRoomInput!) {
        remover_reserva_de_habitacion(
            remover_reserva_de_habitacion_input: $remover_data
        )
    }
`