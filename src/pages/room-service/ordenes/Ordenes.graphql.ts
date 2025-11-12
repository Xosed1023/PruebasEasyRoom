import { gql } from "@apollo/client"

export const ORDENES = gql`
    query Ordenes($orden_id: [ID!]!, $fecha_registro: DateSearchInput) {
        ordenes(orden_id: $orden_id, fecha_registro: $fecha_registro) {
            orden
            orden_id
            consumo_interno_colaborador_id
            estado_pago
            estado_orden
            fecha_registro
            total_con_iva
            total_sin_iva
            renta_id
            renta {
                habitacion_id
                habitacion {
                    numero_habitacion
                    tipo_habitacion_id
                    tipo_habitacion {
                        nombre
                    }
                }
            }
            articulos_orden {
                articulo_id
                articulo_orden_id
                articulo {
                    nombre
                    contenido
                    unidad
                    descripcion
                    precio
                    categoria_id
                    categoria_articulo {
                        nombre
                    }
                }
            }
            pago_id
            pagos {
                pago_id
                fecha_pago
                total
                ticket_id
                detalles_pago {
                    detalle_pago_id
                    pago_id
                    ultimos_digitos
                    subtotal
                    tipo_pago
                    numero_referencia
                    easyrewards_id
                }
            }
        }
    }
`
