import { gql } from "@apollo/client"

export const GetGastosDocument = gql`
    query getGastos(
        $categoria_id: ID
        $hotel_id: ID
        $subcategoria_id: ID
        $usuario_id: ID
        $fecha_gasto: DateSearchInput
    ) {
        gastos(
            categoria_id: $categoria_id
            hotel_id: $hotel_id
            subcategoria_id: $subcategoria_id
            usuario_id: $usuario_id
            fecha_gasto: $fecha_gasto
        ) {
            caja_chica
            gasto_id
            metodo_pago
            usuario_id
            eliminado
            folio
            monto
            comentarios
            corte_id
            categoria_id
            usuario {
                apellido_materno
                apellido_paterno
                nombre
                usuario_id
                roles {
                    eliminado
                    grupo_hotel_id
                    nombre
                    rol_id
                }
            }
            hotel_id
            subcategoria_id
            categoria_id
            categoria_gasto {
                categoria
                categoria_id
            }
            subcategoria_gasto {
                subcategoria
            }
            fecha_gasto
            fecha_registro
        }
    }
`
