import { gql } from "@apollo/client"

export const CREAR_GASTO = gql`
    mutation CrearGastos($datosGasto: CreateGastoInput!) {
        crear_gasto(datos_gastos: $datosGasto) {
            ticket_id
            gasto {
                fecha_gasto
                gasto_id
            }
        }
    }
`
