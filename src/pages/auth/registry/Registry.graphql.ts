import { gql } from "@apollo/client"

export const CREATE_USER = gql`
    mutation Crear_usuario($createUsuarioInput: CreateUsuarioInput!) {
        crear_usuario(datos_usuario: $createUsuarioInput) {
            correo
            eliminado
            estatus
            fecha_registro
            nombre
            password
            puesto_rol
        }
    }
`

export const GET_USER_GOOGLE = gql`
    mutation Obtener_usuario_google($getGoogleUserInput: GetGoogleUserInput!) {
        obtener_usuario_google(getGoogleUserInput: $getGoogleUserInput) {
            email
            family_name
            given_name
            picture
        }
    }
`

export const VERIFY_USER_ACCOUNT = gql`
    mutation Actualizar_usuario($updateUsuarioInput: UpdateUsuarioInput!) {
        actualizar_usuario(datos_usuario: $updateUsuarioInput) {
            verificado
        }
    }
`
