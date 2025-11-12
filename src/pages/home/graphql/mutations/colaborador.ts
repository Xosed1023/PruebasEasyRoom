import { gql } from "@apollo/client"

export const CREAR_COLABORADOR_TAREA = gql`
    mutation CrearColaboradorTarea($datos_colaborador_tarea: CreateColaboradorTareaInput!) {
        crear_colaborador_tarea(datos_colaborador_tarea: $datos_colaborador_tarea) {
            colaborador {
                apellido_materno
                apellido_paterno
                nombre
            }
            colaborador_id
            colaborador_tarea_id
            fecha_inicio
            fecha_termino
            tarea_id
            tipo_limpieza
            comentarios {
                comentario
            }
        }
    }
`
