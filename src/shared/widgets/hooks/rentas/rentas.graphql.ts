import { gql } from "@apollo/client"

export const GET_RENTAS = gql`
    query Rentas($renta_id: [ID!]!, $fecha_registro: DateSearchInput, $fecha_salida: DateSearchInput) {
        rentas(renta_id: $renta_id, fecha_registro: $fecha_registro, fecha_salida: $fecha_salida) {
            renta_id
            fecha_registro
            numero_personas
            personas_extra
            tipo_entrada
            reserva_id
            habitacion_id
            habitacion {
                hotel_id
            }
            extras {
                monto_extra
                tipo_extra
                fecha_pago
            }
        }
    }
`

export const GET_MONTH_PERCENT = gql`
     query getMonthPercent($fecha_final: DateTime!, $fecha_inicial: DateTime!, $hotel_id: ID!) {
        obtener_porcentaje_promedio_ocupacion(
            fecha_final: $fecha_final
            fecha_inicial: $fecha_inicial
            hotel_id: $hotel_id
        )
    }
`
