import { gql } from "@apollo/client"

export const UPDATE_ROOM_STATUS = gql`
    mutation Cambiar_estado($actualizar_habitacion_estado_input: UpdateEstadoHabitacionInput!) {
        actualizar_habitacion_estado(actualizar_habitacion_estado_input: $actualizar_habitacion_estado_input) {
            posicion {
                x
                y
                tamano
            }
            comentario_estado
            eliminado
            estado
            fecha_estado
            habitacion_id
            hotel_id
            numero_habitacion
            rentas_today
            reservas_today
            piso
            usuario_id
            tipo_habitacion_id
            tipo_habitacion {
                clave
                descripcion
                eliminado
                hotel_id
                camas {
                    numero
                    tipo
                }
                minutos_entrada
                minutos_limpieza_detallada
                minutos_limpieza_normal
                minutos_limpieza_retoque
                minutos_pendiente_supervision
                minutos_sucia
                minutos_supervision
                nombre
                personas_incluidas
                tipo_habitacion_id
            }
            ultima_reserva {
                reserva {
                    reserva_id
                    fecha_entrada
                    fecha_salida
                    fecha_registro
                    monto_devuelto_cancelacion
                    comentarios {
                        comentario
                        fecha
                    }
                }
            }
            ultima_renta {
                horas_extra
                fecha_fin
                fecha_condensada
                nombre_huesped
                hospedajes_extra
                fecha_registro
                fecha_salida
                total
                renta_id
                folio
                comentarios {
                    comentario
                    fecha
                }
                numero_personas
                personas_extra
                cliente_id
                nombre_huesped
                reserva_id
                tipo_entrada
                reserva {
                    nombre_huesped
                    origen
                    correo_huesped
                    telefono_huesped
                }
                extras {
                    tipo_extra
                    monto_extra
                    numero
                    extra_id
                    fecha_pago
                }
                easyrewards_id
                pagos {
                    fecha_pago
                    pago_id

                    extras {
                        tipo_extra
                        monto_extra
                        numero
                        extra_id
                    }
                    total
                    detalles_pago {
                        subtotal
                        ultimos_digitos
                        tipo_pago
                        numero_referencia
                        easyrewards_id
                    }
                }
                tarifa_id
                tarifa {
                    nombre
                    costo_persona_extra
                    costo_hora_extra
                    costo_hospedaje_extra
                    personas_extra_max
                    horas_extra_max
                    costo_habitacion
                    hospedajes_extra_max
                }
                subtotales {
                    total_early_checkin
                    total_habitacion
                    total_hospedajes_extra
                }
            }
            ultimas_rentas {
                cliente_id
                horas_extra
            }
            colaborador_tareas_sin_finalizar {
                colaborador_tarea_id
                descripcion_tarea
                fecha_inicio
                tipo_limpieza
                colaborador {
                    nombre
                    apellido_materno
                    apellido_paterno
                }
            }
            ultimos_datos {
                ultima_limpieza {
                    colaborador {
                        apellido_materno
                        apellido_paterno
                        nombre
                    }
                    fecha_termino
                    tipo_limpieza
                    fecha_inicio
                    colaborador_tarea_id
                    colaborador_id
                    comentarios {
                        comentario
                        fecha
                    }
                }
                ultimo_mantenimiento {
                    colaborador {
                        apellido_materno
                        apellido_paterno
                        nombre
                    }
                    fecha_termino
                }
                ultima_supervision {
                    colaborador {
                        apellido_materno
                        apellido_paterno
                        nombre
                    }
                }
            }
        }
    }
`

export const UPDATE_SHORT_ROOM_STATUS = gql`
    mutation Cambiar_estado($actualizar_habitacion_estado_input: UpdateEstadoHabitacionInput!) {
        actualizar_habitacion_estado(actualizar_habitacion_estado_input: $actualizar_habitacion_estado_input) {
            posicion {
                x
                y
                tamano
            }
            estado
            fecha_estado
            colaborador_tareas_sin_finalizar {
                colaborador_tarea_id
                descripcion_tarea
                fecha_inicio
                tipo_limpieza
                colaborador {
                    nombre
                    apellido_materno
                    apellido_paterno
                }
            }
            ultimos_datos {
                ultima_limpieza {
                    colaborador {
                        apellido_materno
                        apellido_paterno
                        nombre
                    }
                    fecha_termino
                    comentarios {
                        comentario
                        fecha
                    }
                }
                ultimo_mantenimiento {
                    colaborador {
                        apellido_materno
                        apellido_paterno
                        nombre
                    }
                    fecha_termino
                }
                ultima_supervision {
                    colaborador {
                        apellido_materno
                        apellido_paterno
                        nombre
                    }
                }
            }
        }
    }
`

export const FREEDOM_ROOM = gql`
    mutation Liberar_habitacion(
        $codigo: String
        $liberar_habitacion_input: ReleaseHabitacionInput!
        $template_sample: String
    ) {
        liberar_habitacion(
            template_sample: $template_sample
            codigo: $codigo
            liberar_habitacion_input: $liberar_habitacion_input
        ) {
            habitacion_id
        }
    }
`

export const LOCK_ROOM = gql`
    mutation Bloquear_habitacion(
        $codigo: String!
        $bloquear_habitacion_input: LockHabitacionInput!
        $template_sample: String!
    ) {
        bloquear_habitacion(
            bloquear_habitacion_input: $bloquear_habitacion_input
            codigo: $codigo
            template_sample: $template_sample
        ) {
            comentario_estado
            eliminado
            estado
            fecha_estado
            habitacion_id
            hotel_id
            numero_habitacion
            rentas_today
            reservas_today
            piso
            usuario_id
            tipo_habitacion_id
            tipo_habitacion {
                clave
                descripcion
                eliminado
                hotel_id
                camas {
                    numero
                    tipo
                }
                minutos_entrada
                minutos_limpieza_detallada
                minutos_limpieza_normal
                minutos_limpieza_retoque
                nombre
                minutos_pendiente_supervision
                minutos_sucia
                minutos_supervision
                personas_incluidas
                tipo_habitacion_id
            }
            ultima_reserva {
                reserva {
                    reserva_id
                    fecha_entrada
                    fecha_salida
                    fecha_registro
                    monto_devuelto_cancelacion
                    comentarios {
                        comentario
                        fecha
                    }
                }
            }
            ultima_renta {
                horas_extra
                fecha_fin
                fecha_condensada
                nombre_huesped
                hospedajes_extra
                fecha_registro
                fecha_salida
                total
                renta_id
                folio
                comentarios {
                    comentario
                    fecha
                }
                numero_personas
                personas_extra
                cliente_id
                nombre_huesped
                reserva_id
                tipo_entrada
                reserva {
                    nombre_huesped
                    origen
                    correo_huesped
                    telefono_huesped
                }
                extras {
                    tipo_extra
                    monto_extra
                    numero
                    extra_id
                    fecha_pago
                }
                pagos {
                    fecha_pago
                    pago_id

                    extras {
                        tipo_extra
                        monto_extra
                        numero
                        extra_id
                    }
                    total
                    detalles_pago {
                        subtotal
                        ultimos_digitos
                        tipo_pago
                        numero_referencia
                        easyrewards_id
                    }
                }
                tarifa_id
                tarifa {
                    nombre
                    costo_persona_extra
                    costo_hora_extra
                    costo_hospedaje_extra
                    personas_extra_max
                    horas_extra_max
                    costo_habitacion
                    hospedajes_extra_max
                }
                subtotales {
                    total_early_checkin
                    total_habitacion
                    total_hospedajes_extra
                }
            }
            ultimas_rentas {
                cliente_id
                horas_extra
            }
            colaborador_tareas_sin_finalizar {
                colaborador_tarea_id
                descripcion_tarea
                fecha_inicio
                tipo_limpieza
                colaborador {
                    nombre
                    apellido_materno
                    apellido_paterno
                }
            }
            ultimos_datos {
                ultima_limpieza {
                    colaborador {
                        apellido_materno
                        apellido_paterno
                        nombre
                    }
                    fecha_termino
                    tipo_limpieza
                    fecha_inicio
                    colaborador_tarea_id
                    colaborador_id
                }
                ultimo_mantenimiento {
                    colaborador {
                        apellido_materno
                        apellido_paterno
                        nombre
                    }
                    fecha_termino
                }
                ultima_supervision {
                    colaborador {
                        apellido_materno
                        apellido_paterno
                        nombre
                    }
                }
            }
        }
    }
`
