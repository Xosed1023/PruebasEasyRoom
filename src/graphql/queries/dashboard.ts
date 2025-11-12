import { gql } from "@apollo/client"

export const GET_TURNOS = gql`
    query getTurnos($hotel_id: [ID!]!) {
        turnos(hotel_id: $hotel_id) {
            nombre
            turno_id
            estado
        }
    }
`

export const GET_INCIDENCIAS = gql`
    query Incidencias($fecha_registro: DateSearchInput, $hotel_id: ID, $turno_id: ID) {
        incidencias(fecha_registro: $fecha_registro, hotel_id: $hotel_id, turno_id: $turno_id) {
            estado
            severidad
            fecha_registro
            turno_id
            turno {
                nombre
            }
        }
    }
`

export const GET_COLABORADORES = gql`
    query Hotel_colaboradores($hotel_id: ID) {
        colaboradores(hotel_id: $hotel_id, eliminado: false, en_turno: true) {
            colaborador_id
            nombre
            apellido_paterno
            turno_id
            foto
            en_turno
            colaborador_id
            ultima_tarea {
                fecha_inicio
                fecha_termino
                habitacion_id
                habitacion {
                    numero_habitacion
                    tipo_habitacion_id
                    tipo_habitacion {
                        nombre
                    }
                }
            }
            ultima_orden {
                orden_id
                mesa {
                    mesa_id
                    numero_mesa
                    ultima_asignacion {
                        mesa_asignada_id
                        fecha_cuenta_cerrada
                    }
                    asignacion_actual {
                        mesa_asignada_id
                        fecha_registro
                    }
                }
            }
            mesa_asignada_activa {
                has_mesa_activa
            }
            puesto {
                nombre
            }
        }
    }
`
