import { gql } from "@apollo/client"

export const AGREGAR_COMENTARIO_A_TAREA = gql`
    mutation AgregarComentarioATarea($comentarios: AddCommentToTaskInput!) {
        agregar_comentarios_a_tarea(comentarios: $comentarios) {
            comentarios {
                comentario
                fecha
            }
        }
    }
`

export const TAREA_EXISTENTE = gql`
    query Tareas($nombre: String) {
        tareas(nombre: $nombre) {
            tarea_id
        }
    }
`
