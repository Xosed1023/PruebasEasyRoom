import { gql } from "@apollo/client"

export const ELIMINAR_SUBCATEGORIA = gql`
    mutation Eliminar_subcategoria_gasto($subcategoria_gasto_data: DeleteSubcategoriaGastoInput!)  {
        eliminar_subcategoria_gasto(subcategoria_gasto_data: $subcategoria_gasto_data) {
            categoria_id
            eliminado
            subcategoria
            subcategoria_gasto_id
        }
    }
`
