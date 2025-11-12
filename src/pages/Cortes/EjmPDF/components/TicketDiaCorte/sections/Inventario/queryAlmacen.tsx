import { gql } from "@apollo/client"

export const GET_ALMACEN = gql`
    query Almacenes($hotel_id: ID) {
        almacenes(almacen_id: [], hotel_id: $hotel_id) {
            almacen_id
            nombre
        }
    }
`

export const GET_ALMACEN_ARTICULOS = gql`
    query Almacenes_articulos {
        almacenes_articulos(almacen_id: [], articulo_id: []) {
          almacenes_articulos {
            almacen_articulo_id
            almacen_id
            articulo_id
            cantidad
            costo
            fecha_movimiento
            hotel_id
            precio
          }
        }
    }
`
