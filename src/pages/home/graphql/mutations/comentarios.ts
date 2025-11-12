import { gql } from "@apollo/client"

export const AGREGAR_COMENTARIO_HABITACION = gql`
  mutation AgregarComentarioHabitacion($input: AddComentarioHabitacionInput!) {
    agregar_comentario_habitacion(agregar_comentario_habitacion_input: $input) {
      habitacion_id
      comentarios {
        comentario_id
        usuario_id
        comentario
        fecha
      }
    }
  }
`
