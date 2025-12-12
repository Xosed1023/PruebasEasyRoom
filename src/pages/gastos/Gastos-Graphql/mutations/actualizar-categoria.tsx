import { gql } from "@apollo/client"

export const ACTUALIZAR_CATEGORIA = gql`
    mutation Actualizar_categoria_gasto($UpdateCategoriaGastosInput: UpdateCategoriaGastosInput!) {
        actualizar_categoria_gasto(categoria_gasto_data: $UpdateCategoriaGastosInput) {
            categoria
            categoria_id
            eliminado
            fecha_registro
            hotel_id
            limite_mensual
            predeterminado
            presupuesto
            usuario_id
        }
    }
`
