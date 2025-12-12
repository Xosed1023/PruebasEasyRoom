import { gql } from "@apollo/client"

export const ROOM_COLABORADORES = gql` 
    query ColaboradoresPorPuesto($datos_busqueda: SearchColaboradoresForTaskInput!) {
        colaboradores_disponibles_por_puesto(datos_busqueda: $datos_busqueda) {
            apellido_materno
            apellido_paterno
            nombre
            foto
            colaborador_id
            colaborador_in_hotel {
                puesto {
                    puesto_id
                    nombre
                }
            }
            en_turno
            ultima_tarea {
                fecha_inicio
                fecha_termino
                colaborador_tarea_id
                habitacion_id
                habitacion {
                    numero_habitacion
                    tipo_habitacion_id
                    tipo_habitacion {
                        nombre
                    }
                }
            }
        }
    }
`

export const COMENTARIOS_COLABORADORES = gql`
    query Colaborador_tarea($colaborador_tarea_id: ID!) {
        colaborador_tarea(colaborador_tarea_id: $colaborador_tarea_id) {
            comentarios {
                comentario
                fecha
            }
        }
    }
`

export const HOTEL_COLABORADORES = gql`
    query ColaboradoresPorHotel($hotel_id: ID!) {
        colaboradores(hotel_id: $hotel_id) {
            apellido_materno
            apellido_paterno
            nombre
            colaborador_id
        }
    }
`
