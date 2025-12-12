import { gql } from "@apollo/client"
import { client } from "src/graphql"

export const getLimiteReserva = (variables: any) =>
    client.query({
        query: gql`
            query Verificar_limite_reservas(
                $fechas_reserva: DateSearchInput!
                $hotel_id: ID!
                $tipo_habitacion_id: ID
            ) {
                verificar_limite_reservas(
                    fechas_reserva: $fechas_reserva
                    hotel_id: $hotel_id
                    tipo_habitacion_id: $tipo_habitacion_id
                ) {
                    alerta_por_limite_reservas
                    fecha_conflicto
                }
            }
        `,
        variables,
    })
