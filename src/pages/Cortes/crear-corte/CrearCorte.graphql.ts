import { gql } from "@apollo/client"

export const GET_INCIDENCIAS = gql`
    query ($hotel_id: ID, $turno_id: ID, $estado: estados_incidencias, $fecha_registro: DateSearchInput) {
        incidencias(hotel_id: $hotel_id, turno_id: $turno_id, estado: $estado, fecha_registro: $fecha_registro) {
            incidencia_id
            detalle
            folio
            estado
            colaborador_id_reporta
            colaborador_reporta {
                nombre
                apellido_paterno
                apellido_materno
                puesto {
                    nombre
                }
            }
            colaborador_id_cierra
            colaborador_cierra {
                nombre
                apellido_paterno
                apellido_materno
            }
            area
            severidad
            habitacion_id
            habitacion {
                habitacion_id
                numero_habitacion
                tipo_habitacion_id
                tipo_habitacion {
                    tipo_habitacion_id
                    nombre
                }
            }
        }
    }
`

export const GET_CORTE = gql`
    query getCorte($corte_id: ID!) {
        corte(corte_id: $corte_id) {
            corte_id
            fecha_fin_corte
            fecha_inicio_corte
            turno_id
        }
    }
`
