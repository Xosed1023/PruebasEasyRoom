import { CancelDetalleOrdenInput, CancelExtraDetalleOrdenInput, EditOrdenInput, TipoArticulo } from "src/gql/schema"

export type State = {
    cancelaciones_detalles: CancelDetalleOrdenInput[]
    cancelaciones_extras: CancelExtraDetalleOrdenInput[]
}

export interface ExtraDetalleOrdenItemForm {
    precio: number
    extra_detalle_orden_id: string | null
    almacen_articulo_id: string
    nombre: string
    categoria: string
    categoria_id: string
    cantidad: number
    costo_con_iva: number
    costo_sin_iva: number
    monto_iva: number
    costo: number
}

export interface AlmacenArticuloForm {
    almacen_articulo_id: string
    detalle_orden_id: string
    nombre: string
    cantidad: number
    precio: number
    costo: number
    categoria: string
    categoria_id: string
    comanda_id?: string
    comentarios?: string
    tipo: TipoArticulo
    costo_con_iva: number
    costo_sin_iva: number
    extra_detalle_orden?: ExtraDetalleOrdenItemForm[]
    monto_iva: number
}

export interface DefaultValues extends Omit<EditOrdenInput, "detalles_orden"> {
    detalles_orden: AlmacenArticuloForm[]
}
