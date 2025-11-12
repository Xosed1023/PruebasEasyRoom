import { gql } from "@apollo/client"

export const GET_ROOM_SERVICE_ROOM = gql`
    query GetRoomServiceByRoom($habitacion_id: ID!) {
        habitacion(habitacion_id: $habitacion_id) {
            habitacion_id
            ultima_renta {
                renta_id
                folio
                ordenes {
                    orden
                    orden_id
                    fecha_registro
                    total_con_iva
                    total_sin_iva
                    detalles_orden {
                        almacen_articulo_id
                        almacen_articulo {
                            articulo {
                                nombre
                                descripcion
                                precio {
                                    monto
                                }
                                unidad
                                contenido
                                articulo_id
                                categoria_id
                                categoria_articulo {
                                    nombre
                                }
                            }
                        }
                    }
                    easyrewards_id
                    pago_id
                    pago {
                        detalles_pago {
                            ultimos_digitos
                            tipo_pago
                            numero_referencia
                            easyrewards_id
                        }
                    }
                    pago_id
                    pago {
                        ticket_id
                    }
                }
            }
        }
    }
`
