export interface FormValues {
    articulos: {
        articulo_id: string
        almacen_origen: string
        almacen_destino: string
        disponible: number
        cantidad: string
        almacenes: { almacen_id: string; cantidad: number }[]
    }[]
}
