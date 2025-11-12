import { gql } from "@apollo/client"

// alerta_incidenca, filtro de incidencia por el cual va a mostrarse el icono de alerta en las cards

export const GET_ROOMS = gql`
    query Habitaciones($hotel_id: ID!, $usuario_id: ID!) {
        habitaciones(hotel_id: $hotel_id) {
            numero_habitacion
            estado
            comentario_estado
            alerta_incidencia(tipo_incidencia: [mantenimiento]) {
                incidencia_id
            }
            posicion {
                tamano
                x
                y
            }
            incidencias_activas
            incidencias_activas_usuario(usuario_id: $usuario_id)
            incidencias(estado: activa) {
                tipo_incidencia
            }
            fecha_estado
            habitacion_id
            hotel_id
            tipo_habitacion_id
            tipo_habitacion {
                minutos_limpieza_detallada
                minutos_limpieza_normal
                minutos_limpieza_retoque
                minutos_pendiente_supervision
                minutos_sucia
                minutos_supervision
                nombre
            }
            ultima_reserva {
                reserva {
                    nombre_huesped
                    fecha_entrada
                    fecha_salida
                    numero_personas
                    reserva_id
                    comentarios {
                        comentario
                    }
                    tarifa_id
                    tarifa {
                        hora_checkin
                        hora_checkout
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
                }
            }
            ultima_renta {
                fecha_antigua_por_entregar
                ultimos_conceptos_pendientes {
                    renta_id
                    renta {
                        fecha_registro
                    }
                    extra_id
                    extra {
                        tipo_extra
                        fecha_solicitud
                    }
                    orden_id
                    orden {
                        orden
                        deposito
                        estado_pago
                        fecha_registro
                    }
                }
                fecha_registro
                fecha_fin
                horas_extra
                estado
                ultima_orden {
                    orden_activa
                    orden {
                        fecha_registro
                        estado_pago
                        estado_orden
                    }
                }
                nombre_huesped
                numero_personas
                hospedajes_extra
                cliente_id
                vehiculo {
                    matricula
                    color
                    marca
                    modelo
                }
                fecha_condensada
                renta_id
                folio
                reserva_id
                tipo_entrada
                tarifa_id
                tarifa {
                    duracion_renta
                }
                easyrewards_id
                pagos {
                    pago_id
                    detalles_pago {
                        easyrewards_id
                    }
                }
                subtotales {
                    total_early_checkin
                    total_habitacion
                    total_hospedajes_extra
                    total_horas_extra
                    total_personas_extra
                }
            }
            colaborador_tareas_sin_finalizar {
                tarea_id
                descripcion_tarea
                tarea_id
                fecha_inicio
                fecha_termino
                tipo_limpieza
                colaborador_tarea_id
                colaborador_id
                colaborador {
                    foto
                    nombre
                    apellido_materno
                    apellido_paterno
                }
            }
        }
    }
`

export const GET_ROOM = gql`
    query GetHabitacion($habitacion_id: ID!, $usuario_id: ID!) {
        habitacion(habitacion_id: $habitacion_id) {
            comentario_estado
            eliminado
            estado
            incidencias_activas
            incidencias_activas_usuario(usuario_id: $usuario_id)
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
                minutos_supervision
                nombre
                personas_incluidas
                tipo_habitacion_id
            }
            comentarios {
                comentario
                fecha
                comentario_id
                usuario_id
            }
            ultima_reserva {
                reserva {
                    reserva_id
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
                        costo_persona_extra
                        tipo_alojamiento
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
                    easyrewards_id
                    pagos {
                        pago_id
                        total
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
            ultima_renta {
                horas_extra
                ticket_id
                es_renta_cancelable
                tiene_ventas_cancelables
                fecha_fin
                estado
                saldo_pendiente_estancia
                saldo_pendiente_ordenes
                fecha_condensada
                nombre_huesped
                hospedajes_extra
                fecha_registro
                fecha_salida
                nombre_huesped
                total
                renta_id
                corte_id
                folio
                propinas {
                    total
                    detalles_pago {
                        tipo_pago
                        ultimos_digitos
                        subtotal
                        numero_referencia
                    }
                }
                vehiculo {
                    matricula
                    color
                    marca
                    modelo
                }
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
                    easyrewards_id
                    pagos {
                        pago_id
                        detalles_pago {
                            subtotal
                            numero_referencia
                            easyrewards_id
                        }
                    }
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
                    duracion_renta
                    horas_extra_max
                    costo_habitacion
                    hospedajes_extra_max
                    tipo_alojamiento
                    hora_checkin
                }
                ordenes {
                    orden
                    orden_id
                    fecha_registro
                    total_con_iva
                    total_sin_iva
                    estado_orden
                    detalle_pago_pre_cargado {
                        tipo_pago
                        ultimos_digitos
                        numero_referencia
                    }
                    detalles_orden(estado: [en_preparacion, en_entrega, por_entregar, entregada]) {
                        detalle_orden_id
                        estado
                        almacen_articulo {
                            articulo {
                                nombre
                                contenido
                                descripcion
                                precio {
                                    monto
                                }
                                unidad
                                articulo_id
                                categoria_id
                                categoria_articulo {
                                    nombre
                                }
                            }
                        }
                        comentarios
                    }
                    easyrewards_id
                    pago_id
                    pagos {
                    pago_id
                    fecha_pago
                        detalles_pago {
                            subtotal
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
                    propina {
                        total
                        detalles_pago {
                            tipo_pago
                            ultimos_digitos
                            subtotal
                            numero_referencia
                        }
                    }
                }
                subtotales {
                    total_early_checkin
                    total_habitacion
                    total_hospedajes_extra
                    total_horas_extra
                    total_personas_extra
                }
            }
            ultimas_rentas {
                cliente_id
                horas_extra
            }
            renta_pasada {
                fecha_salida
            }
            colaborador_tareas_sin_finalizar {
                tarea_id
                colaborador_tarea_id
                descripcion_tarea
                fecha_inicio
                fecha_termino
                tipo_limpieza
                colaborador_id
                colaborador {
                    foto
                    colaborador_in_hotel {
                        puesto {
                            descripcion
                            nombre
                            descripcion
                            puesto_id
                        }
                    }
                    nombre
                    foto
                    apellido_materno
                    apellido_paterno
                }
                comentarios {
                    comentario
                    fecha
                }
            }
            ultimos_datos {
                ultima_limpieza {
                    colaborador_id
                    colaborador {
                        apellido_materno
                        apellido_paterno
                        nombre
                        foto
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
                    colaborador_id
                    colaborador {
                        apellido_materno
                        apellido_paterno
                        nombre
                        foto
                    }
                    fecha_termino
                }
                ultima_supervision {
                    colaborador_id
                    colaborador {
                        apellido_materno
                        apellido_paterno
                        nombre
                        foto
                    }
                }
            }
            tarea_en_curso {
                tarea_id
                fecha_inicio
                colaborador_tarea_id
                tipo_tarea
                reportada_por {
                    nombre
                    apellido_paterno
                    apellido_materno
                }
            }
        }
    }
`
