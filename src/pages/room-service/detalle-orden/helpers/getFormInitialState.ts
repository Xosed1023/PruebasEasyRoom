import { Orden, TipoArticulo } from "src/gql/schema"
import { DefaultValues } from "../DetalleOrden"
import { useIVA } from "src/shared/hooks/useIVA"

export const getDetallesOrdenFormat = (detalles_orden: any[]) => {
    const { getIVA, getSubtotal } = useIVA()
    return (
        detalles_orden?.map((d) => ({
            almacen_articulo_id: d.almacen_articulo_id,
            costo_con_iva: d.costo_con_iva,
            detalle_orden_id: d.detalle_orden_id,
            costo_sin_iva: getSubtotal(d.costo_con_iva || 0),
            cantidad: d.cantidad,
            tipo: d.almacen_articulo?.articulo?.tipo || TipoArticulo.Venta,
            categoria_id: d.almacen_articulo?.articulo?.categoria_id || "",
            categoria: d.almacen_articulo?.articulo?.categoria_articulo?.nombre || "",
            costo: d.almacen_articulo?.articulo?.costo?.monto || 0,
            nombre: d.almacen_articulo?.articulo?.nombre || "",
            precio: d.almacen_articulo?.articulo?.precio?.monto || 0,
            monto_iva: getIVA(d.almacen_articulo?.articulo?.precio?.monto || 0),
            comentarios: d.comentarios || "",
            extra_detalle_orden: d.extras?.map((e) => ({
                ...e,
                precio: e.almacen_articulo?.articulo?.precio?.monto || 0,
                nombre: e.almacen_articulo?.articulo?.nombre || "",
                extra_detalle_orden_id: e.extra_detalle_orden_id || "",
                categoria: e.almacen_articulo?.articulo?.categoria_articulo?.nombre || "",
                categoria_id: e.almacen_articulo?.articulo?.categoria_id || "",
                costo: e.almacen_articulo?.articulo?.costo?.monto || 0,
                costo_con_iva: e.almacen_articulo?.articulo?.precio?.monto || 0,
                costo_sin_iva: getSubtotal(e.almacen_articulo?.articulo?.costo?.monto || 0),
                monto_iva: getIVA(e.almacen_articulo?.articulo?.costo?.monto || 0),
            })),
        })) || []
    )
}

const getFormInitialState = ({
    orden,
    hotel_id,
    usuario_id,
}: {
    orden?: Orden
    hotel_id: string
    usuario_id: string
}): DefaultValues => {

    return {
        orden_id: orden?.orden_id || "",
        detalles_orden: getDetallesOrdenFormat(orden?.detalles_orden || []),
        usuario_id,
    }
}

export default getFormInitialState
