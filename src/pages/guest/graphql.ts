import { gql } from "@apollo/client"

export const CREAR_RESERVA = gql`
    mutation Crear_reserva($crear_reserva_input: CreateReservaInput!) {
        crear_reserva(crear_reserva_input: $crear_reserva_input) {
            reserva_id
        }
    }
`

export const CREAR_CLIENTE = gql`
    mutation Crear_cliente($datos_cliente: CreateClienteInput!) {
        crear_cliente(datos_cliente: $datos_cliente) {
            cliente_id
        }
    }
`
