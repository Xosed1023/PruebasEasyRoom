import { gql } from "@apollo/client"

export const ADD_EXTRA = gql`
    mutation AgregarExtrasRenta($datos_renta: AddExtrasRentaInput!) {
        agregar_extras_renta(AddExtrasRentaInput: $datos_renta)
    }
`

export const ADD_COMENTARIO_RENTA = gql`
    mutation AgregarComentarioRenta($agregar_comentario_renta: AddComentarioRentaInput!) {
        agregar_comentario_renta(AddComentarioRentaInput: $agregar_comentario_renta)
    }
`
