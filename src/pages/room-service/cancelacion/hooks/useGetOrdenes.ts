import { DetalleOrden, Orden, useGetComandaCancelacionLazyQuery, useCancelacionOrdenesLazyQuery } from "src/gql/schema"
import { sum } from "src/shared/helpers/calculator";

const useGetOrdenes = ({ mode, ordenOComandaID }: { mode: "order" | "comanda"; ordenOComandaID: string }) => {
    const [getOrdenes] = useCancelacionOrdenesLazyQuery()
    const [getComanda] = useGetComandaCancelacionLazyQuery()

    const getDetalles = (): Promise<{
        orden: Orden | null
        detallesOrden: DetalleOrden[] | null
        folioComanda: string | null
        total_con_iva: number | null
    }> => {
        let detalles: {
            orden: Orden | null
            detallesOrden: DetalleOrden[] | null
            folioComanda: string | null
            total_con_iva: number | null
        } = {
            orden: null,
            folioComanda: null,
            detallesOrden: [],
            total_con_iva: null,
        }
        if (mode === "order") {
            return getOrdenes({
                variables: {
                    orden_id: [ordenOComandaID],
                    fecha_registro: null,
                },
            }).then((v) => {
                const ordenesFilteredCanceladas = v.data?.ordenes?.[0].detalles_orden?.filter(o => !o.fecha_cancelacion)
                detalles = {
                    detallesOrden: ordenesFilteredCanceladas
                        ? (ordenesFilteredCanceladas as DetalleOrden[])
                        : null,
                    orden: v.data?.ordenes[0] ? (v.data?.ordenes[0] as Orden) : null,
                    folioComanda: null,
                    total_con_iva: v.data?.ordenes[0].total_con_iva || 0,
                }
                return detalles
            })
        }
        return getComanda({
            variables: {
                comanda_id: ordenOComandaID,
            },
        }).then((v) => {
            const total_con_iva = sum(v.data?.comanda.detalles_orden?.map(d => d.almacen_articulo?.articulo?.precio?.monto || 0) || [])
            detalles = {
                detallesOrden: v.data?.comanda.detalles_orden
                    ? (v.data?.comanda.detalles_orden as DetalleOrden[])
                    : null,
                orden: null,
                folioComanda: (v.data?.comanda.orden?.orden || "") + "-" + (v.data?.comanda.folio?.toString().padStart(2, '0') || ""),
                total_con_iva,
            }
            return detalles
        })
    }

    return [getDetalles]
}

export default useGetOrdenes
