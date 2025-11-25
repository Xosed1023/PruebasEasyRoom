import { gql } from "@apollo/client"
import { client } from "src/graphql"

export const GET_HABITACION = gql`
    query GetHabitacion($habitacion_id: ID!, $hotel_id: ID!) {
        habitacion(habitacion_id: $habitacion_id) {
            tipo_habitacion_id
            tipo_habitacion {
                nombre
            }
            numero_habitacion
        }
    }
`

export const CREATE_RENTA = gql`
    mutation CreateRenta($datos_renta: CreateRentaInput!) {
        crear_renta(datos_renta: $datos_renta) {
            renta {
                renta_id
                folio
                horas_extra
                fecha_fin
                fecha_registro
                fecha_salida
                numero_personas
                saldo
            }
            ticket {
                ticket_id
            }
        }
    }
`

export const getQueryData = async (params: any) => {
    try {
        const { data } = await client.query({ ...params })

        if (data) return data
    } catch (e) {
        console.log(e)
        return {}
    }
}
