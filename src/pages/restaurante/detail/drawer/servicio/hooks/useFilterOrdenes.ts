import { useMemo } from "react"
import { EstadosOrdenHistorial } from "src/gql/schema"
import { minus } from "src/shared/helpers/calculator"
import { FilterOrders } from "../types/orders"

export function useFilterOrdenes(orden: any): FilterOrders {
    const getFormat = (comandas: any[]) => {
        let format: any[] = []
        comandas?.forEach((c) => {
            c?.detalles_orden?.forEach((d) => {
                const comanda = { ...c, estado_comanda: d?.estado, detalles_orden: [d] }
                const find = format.find(
                    (i) => i?.comanda_id === comanda?.comanda_id && i?.estado_comanda === comanda?.estado_comanda
                )

                if (find) {
                    format = format.map((f) => {
                        const detalles = comanda.detalles_orden?.filter((a) => a.estado === f.estado_comanda)
                        return find?.comanda_id === f?.comanda_id
                            ? { ...f, detalles_orden: [...f.detalles_orden, ...detalles] }
                            : f
                    })
                } else {
                    format = [...format, comanda]
                }
            })
        })

        return format.sort((a, b) => a?.folio - b?.folio)
    }

    const res = useMemo(() => {
        const preparacion: any[] = []
        const entregar: any[] = []
        const entregada: any[] = []

        const totalPagado = orden?.pago?.total || 0
        const totalPorPagar = minus(orden?.total_con_iva || 0, totalPagado || 0)

        if (orden) {
            const comandas = getFormat(orden?.comandas || []) || []

            comandas?.forEach((c) => {
                const estado: string = c?.estado_comanda || ""
                const item = {
                    ...c,
                    orden: `${orden?.orden}-${String(c?.folio || "")?.padStart(2, "0")}`,
                    comanda_id: c?.comanda_id || "",
                }

                if (estado === EstadosOrdenHistorial.EnPreparacion) {
                    preparacion.push(item)
                }
                if (estado === EstadosOrdenHistorial.PorEntregar) {
                    entregar.push(item)
                }
                if (estado === EstadosOrdenHistorial.Entregada || estado === EstadosOrdenHistorial.EnEntrega) {
                    entregada.push(item)
                }
            })
        }

        return {
            preparacion,
            entregar,
            entregada,
            pagado: totalPagado,
            por_pagar: totalPorPagar,
        }
    }, [orden])

    return res
}
