import { gql } from "@apollo/client"

export const GET_LAST_RESERVATION_FROM_ROOM = gql`
    query getLastReservaFromRoom($reserva_id: ID!) {
        reserva(reserva_id: $reserva_id) {
            reserva_id
            hospedajes_extra
            folio
            estado
            fecha_cancelacion
            fecha_salida
            fecha_entrada
            origen
            tipo_habitacion_id
            tipo_de_habitacion {
                nombre
            }
            habitacion_id
            habitacion {
                numero_habitacion
                habitacion_id
                tipo_habitacion {
                    nombre
                }
            }
            tarifa_id
            tarifa {
                nombre
                personas_extra_max
                costo_habitacion
                costo_persona_extra
                costo_early_checkin
                tipo_alojamiento
                hora_checkin
                hora_checkout
                tarifa_id
                nombre
            }
            correo_huesped
            nombre_huesped
            telefono_huesped
            numero_personas
            personas_extras
            usuario {
                nombre
            }
            estado_pago
            total
            pagos {
                pago_id
                total
                fecha_pago
                detalles_pago {
                    detalle_pago_id
                    subtotal
                    tipo_pago
                    ultimos_digitos
                    numero_referencia
                    easyrewards_id
                }
                extras {
                    monto_devuelto_cancelacion
                    fecha_cancelacion
                    fecha_pago
                    fecha_solicitud
                    monto_extra
                    motivo_cancelacion
                    numero
                    tipo_extra
                }
            }
            experiencias_reserva {
                experiencia_reserva_id
                experiencia_id
                total
                estado
                experiencia {
                    nombre
                }
            }
            comentarios {
                comentario
            }
        }
    }
`
