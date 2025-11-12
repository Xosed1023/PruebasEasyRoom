import { gql, useQuery } from "@apollo/client"
import { useParams } from "react-router-dom"

const QUERY = gql`
    query Incidencias($habitacion_id: ID!) {
        incidencias(habitacion_id: $habitacion_id, estado: activa) {
            incidencia_id
            detalle
            habitacion_id
            folio
            fecha_registro
            fecha_cierre
            colaborador_id_reporta
            estado
            huesped
            matricula
            tipo_incidencia
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
            turno_id
            turno {
                nombre
            }
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

export function useFetch() {
    const params = useParams()

    const { loading, data, refetch } = useQuery(QUERY, { variables: { habitacion_id: params?.habitacion_id } })
    const habitacion = data?.incidencias?.[0]?.habitacion

    return {
        loading,
        incidencias: Array.isArray(data?.incidencias) ? [...data.incidencias] : [],
        habitacion: habitacion ? `${habitacion?.tipo_habitacion?.nombre} ${habitacion?.numero_habitacion}` : "",
        refetch,
    }
}
