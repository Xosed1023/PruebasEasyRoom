import { gql } from "@apollo/client"

export const OBTENER_TICKET = gql`
    query Ticket($ticket_id: ID!) {
        ticket(ticket_id: $ticket_id) {
            cancelado
            consumo_interno
            cortesia
            fecha_cancelacion
            motivo_cancelacion
            data {
                articulos {
                    articulo_id
                    cantidad
                    costo
                    nombre
                }
                extras {
                    cantidad
                    costo
                    tipo
                }
                habitaciones {
                    costo
                    early_checkin
                    numero
                    tipo
                }
                metodos_pago {
                    numero_referencia
                    tipo
                    total
                    ultimos_digitos
                }
                propinas {
                    procedencia
                    tipo_pago
                    total
                    ultimos_digitos
                }
                renta {
                    descripcion
                    habitacion_id
                    numero_habitacion
                }
                nombre_tarifa
            }
            fecha_impresion
            folio
            hotel_id
            monto_fajilla
            reserva {
                cliente_id
                codigo_ota
                estado
                estado_pago
                fecha_cancelacion
                fecha_entrada
                fecha_registro
                fecha_salida
                hospedajes_extra
                monto_devuelto_cancelacion
                motivo_cancelacion
                nombre_huesped
                origen
                saldo
                tipo_habitacion_id
                total
            }
            reserva_id
            saldo
            ticket_id
            usuario {
                apellido_materno
                apellido_paterno
                nombre
            }
            usuario_id
        }
    }
`
