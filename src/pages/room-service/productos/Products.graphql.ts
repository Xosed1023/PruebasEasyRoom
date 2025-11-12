import { gql } from "@apollo/client"

export const CATEGORIAS = gql`
    query Categorias_articulos($categoria_id: [ID!]!) {
        categorias_articulos(categoria_id: $categoria_id) {
            categoria_id
            nombre
        }
    }
`

export const ARTICULOS = gql`
    query Articulos($hotel_id: ID, $categoria_id: ID, $nombre: String) {
        articulos(hotel_id: $hotel_id, categoria_id: $categoria_id, nombre: $nombre, insumo: false, eliminado: false) {
            articulo_id
            cantidad_minima
            categoria_id
            contenido
            descripcion
            foto
            marca
            nombre
            precio
            stock
            unidad
        }
    }
`
