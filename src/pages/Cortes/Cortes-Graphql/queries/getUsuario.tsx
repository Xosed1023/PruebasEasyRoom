import { gql } from "@apollo/client"

export const GET_USUARIO = gql`
    query Usuario($usuario_id: ID!) {
        usuario(usuario_id: $usuario_id) {
            apellido_materno
            apellido_paterno
            nombre
        }
    }
`
