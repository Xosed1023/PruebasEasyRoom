import { gql } from "@apollo/client"

export const GET_CATEGORIAS = gql`
    query Categorias_gasto($hotel_id: ID!) {
        categorias_gasto(hotel_id: $hotel_id, eliminado: false) {
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
