import { gql, OperationVariables, QueryResult, useQuery } from "@apollo/client"
import { useProfile } from "src/shared/hooks/useProfile"

export const QUERY = gql`
    query Propinas($fecha_registro: DateSearchInput, $hotel_id: ID!) {
        propinas(fecha_registro: $fecha_registro, hotel_id: [$hotel_id]) {
            fecha_registro
            propina_id
            corte_id
            comentarios
            eliminado
            fecha_registro
            folio
            procedencia
            procedencia_id
            total
            turno_id
            turno {
                nombre
            }
            colaborador_id
            colaborador {
                nombre
                apellido_paterno
                apellido_materno
            }
            habitacion {
                habitacion_id
                numero_habitacion
            }
            mesa {
                numero_mesa
            }
            detalles_pago {
                tipo_pago
                numero_referencia
                ultimos_digitos
                subtotal
            }
        }
    }
`

export function useFetch(): QueryResult<any, OperationVariables> {
    const date = new Date()
    const { hotel_id } = useProfile()
    const variables = {
        fecha_registro: {
            fecha_inicial: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0).toISOString(),
            fecha_final: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 59).toISOString(),
        },
        hotel_id,
    }

    const { data, ...rest } = useQuery(QUERY, { variables })

    return {
        data: data?.propinas || [],
        ...rest,
        variables,
    }
}
