import { gql } from "@apollo/client"

export const CREAR_FAJILLA = gql`
    mutation Crear_fajilla($crearFajillaInput: CreateFajillaInput!) {
        crear_fajilla(crear_fajilla_input: $crearFajillaInput) {
            fajilla_id
            ticket_id
            fecha_autorizaicion
            fecha_creacion
        }
    }
`
