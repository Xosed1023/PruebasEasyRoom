import { gql, useQuery } from "@apollo/client"
import { useCategorias_GastoQuery } from "src/gql/schema"
import { useProfile } from "src/shared/hooks/useProfile"

const CATEGORIAS_GASTO_CON_ELIMINADAS = gql`
    query Categorias_gasto($hotel_id: ID!) {
        categorias_gasto(hotel_id: $hotel_id) {
            categoria
            categoria_id
            eliminado
            fecha_registro
            hotel_id
            limite_mensual
            predeterminado
            presupuesto
            usuario_id
            subcategorias_de_categoria {
                categoria_id
                eliminado
                subcategoria
                subcategoria_gasto_id
            }
        }
    }
`

/*
-Pendiente
const { data } = useGetCategoriaGastosQuery({
        variables: {
            hotel_id,
            predeterminado: true,
            usuario_id
        }
    })

*/

export function useCategoriaGastos(variables?: any) {
    const { hotel_id } = useProfile()

    const data = useCategorias_GastoQuery({
        variables: {
            hotel_id,
            ...variables,
        },
    })
    return data
}

export function useCategoriaGastosConEliminadas(variables?: any) {
    const { hotel_id } = useProfile()

    const response = useQuery(CATEGORIAS_GASTO_CON_ELIMINADAS, {
        variables: {
            hotel_id,
            ...variables,
        },
    })

    return response
}
