import { useMemo } from "react"
import { useClearRepeatItems } from "src/pages/home/room-detail/drawer/ocupada/sections/tabs/roomService/hooks"

export function useTable(ordenes: any[], estancia: any[], type: string) {
    const { getClearList } = useClearRepeatItems()

    const mapItem = (item: any, extrasKey: string | null = null, isProduct = false) => ({
        name: isProduct ? item?.almacen_articulo?.articulo?.descripcion || "" : item?.detalle || "",
        number: item?.cantidad || 0,
        cost: isProduct ? item?.costo_con_iva || 0 : item?.precio || 0,
        iva: Number(isProduct ? item?.monto_iva || 0 : item?.iva || 0) * Number(item?.cantidad || 1),
        total: isProduct ? Number(item?.costo_con_iva || 0) * Number(item?.cantidad || 0) : item?.total || 0,
        extras: extrasKey && item?.[extrasKey] ? item[extrasKey].map((e: any) => mapItem(e, extrasKey, isProduct)) : [],
    })

    const getProductList = (articulos: any[]) => getClearList(articulos).map((item) => mapItem(item, "extras", true))

    const getEstanciaList = (estancia: any) => {
        const list = Array.isArray(estancia) ? estancia : [estancia]
        return getClearList(list).map((item) => mapItem(item, "extras_checkin", false))
    }

    const getExtrasList = (extra: any) => {
        const list = Array.isArray(extra?.conceptos) ? extra.conceptos : []
        return list.map((item) => mapItem(item, "extras_checkin", false))
    }

    const { rowsOrdenes, rowsEstancia } = useMemo(() => {
        const rowsOrdenes = ordenes.map((item) => [item?.orden || "", getProductList(item?.detalles_orden || [])])
        const rowsEstancia = estancia.map((item) =>
            item?.conceptos ? [item?.folio || 0, getExtrasList(item)] : [item?.folio || 0, getEstanciaList(item)]
        )
        return { rowsOrdenes, rowsEstancia }
    }, [ordenes.length, estancia.length, type])

    return { rowsOrdenes: rowsOrdenes || [], rowsEstancia: rowsEstancia || [] }
}
