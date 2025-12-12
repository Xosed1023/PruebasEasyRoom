import { gql } from "@apollo/client"

export const GET_VENTAS_RENTAS = gql`
    query getVentasRentas($fecha_final: DateUTC!, $fecha_inicial: DateUTC!, $hotel_id: ID!) {
        obtener_ventas_rentas(fecha_final: $fecha_final, hotel_id: $hotel_id, fecha_inicial: $fecha_inicial) {
            acumulado_rentas {
                subtotal
                turno
            }
        }
    }
`

export const GET_VENTAS_EXTRAS = gql`
    query getVentasExtras($fecha_final: DateUTC!, $fecha_inicial: DateUTC!, $hotel_id: ID!) {
        obtener_ventas_extras(fecha_final: $fecha_final, fecha_inicial: $fecha_inicial, hotel_id: $hotel_id) {
            acumulado_extras {
                subtotal
                turno
            }
        }
    }
`

export const GET_VENTAS_RESERVAS = gql`
    query getVentasReservas($fecha_final: DateUTC!, $fecha_inicial: DateUTC!, $hotel_id: ID!) {
        obtener_ventas_reservas(fecha_final: $fecha_final, fecha_inicial: $fecha_inicial, hotel_id: $hotel_id) {
            acumulado_reservas {
                subtotal
                turno
            }
        }
    }
`

export const GET_VENTAS_ORDENES = gql`
    query getVentasOrdenes($fecha_final: DateUTC!, $fecha_inicial: DateUTC!, $hotel_id: ID!) {
        obtener_ventas_ordenes(fecha_final: $fecha_final, fecha_inicial: $fecha_inicial, hotel_id: $hotel_id) {
            acumulado_ordenes {
                subtotal
                turno
            }
        }
    }
`

export const GET_ROOM_TOP = gql`
    query Habitacion_top_rentas_del_dia($hotel_id: String!) {
        habitacion_top_rentas_del_dia(hotel_id: $hotel_id) {
            ventas
            habitacion {
                habitacion_id
                numero_habitacion
                tipo_habitacion {
                    nombre
                }
            }
        }
    }
`

export const GET_VENTAS = gql`
    query Obtener_ventas($get_today_sales_input: GetTodaySalesInput!) {
        obtener_ventas(get_today_sales_input: $get_today_sales_input) {
            nombre
            total_extras
            total_ordenes
            total_propinas
            total_rentas
            total_reservas
        }
    }
`
