import { getDateStringMDYH, getExactDate } from "src/utils/date"

export function useClearRepeatItems() {
    const getClearRepeats = (array: any[]): any[] => {
        let list: any[] = []
        for (const i of array) {
            const find = list?.find((item) => item.almacen_articulo_id === i?.almacen_articulo_id)
            const tipo = find?.almacen_articulo?.articulo?.tipo
            const extras = find?.extras?.length

            if (find && tipo !== "receta" && extras < 1) {
                list = [
                    ...list.map((a) => {
                        return find?.almacen_articulo_id === a?.almacen_articulo_id
                            ? { ...a, cantidad: a?.cantidad + 1 }
                            : a
                    }),
                ]
            } else {
                list.push({ ...i, cantidad: i?.cantidad || 1 })
            }
        }

        return list
    }

    const getClearList = (array: any[]) => {
        const list = getClearRepeats(array)
        return list.map((item) => {
            return {
                ...item,
                extras: item?.extras?.length > 0 ? item?.extras : [],
            }
        })
    }

    const getClearOrders = (array: any[]) => {
        return array.map((item) => {
            return {
                ...item,
                detalles_orden: item?.detalles_orden?.length > 0 ? getClearList(item?.detalles_orden) : [],
            }
        })
    }

    const getItemsFormat = (array: any[]) => {
        return getClearOrders(array).map((o) => {
            return {
                orden_id: o?.orden_id,
                title: o?.orden || "",
                description: o?.fecha_registro ? getDateStringMDYH(getExactDate(o?.fecha_registro)) : "",
                propina: o?.propina?.total || 0,
                ticket_id: o?.pago?.ticket_id,
                comanda_id: o?.comanda_id || "",
                estado: o?.estado_orden || "",
                pago_id: o.pago_id || "",
                total_con_iva: o?.total_con_iva || 0,
                data:
                    o?.detalles_orden?.map((d) => {
                        const tipo = d?.almacen_articulo?.articulo?.tipo
                        const extra = d?.almacen_articulo?.articulo?.extra
                        return {
                            label: d?.almacen_articulo?.articulo?.nombre,
                            value: Number(d?.costo_con_iva || 0) * Number(d?.cantidad || 0),
                            size: tipo !== "receta" || extra ? d?.cantidad : 0,
                            comment: d?.comentarios || "",
                            extras:
                                d?.extras?.map((e) => {
                                    return {
                                        label: e?.almacen_articulo?.articulo?.nombre,
                                        value: e?.costo_con_iva || 0,
                                        size: e?.cantidad || 0,
                                    }
                                }) || [],
                        }
                    }) || [],
            }
        })
    }

    const getArticulosForRS = (detalles_orden: any[]) => {
        const products: any[] = []
        const clear = getClearList(detalles_orden || [])
        clear.forEach((p) => {
            const a = p?.almacen_articulo?.articulo

            const repeatSize = products.filter((i) => i.id?.split("__")?.at(0) === p?.almacen_articulo_id)?.length || 0

            const item = {
                id: a?.tipo !== "receta" ? p?.almacen_articulo_id : `${p?.almacen_articulo_id}__${repeatSize}`,
                name: a?.nombre,
                cost: p?.costo_con_iva || 0,
                number: p?.cantidad || 0,
                comment: p?.comentarios || "",
                categoryId: a?.categoria_id,
                category: a?.categoria_articulo?.nombre,
                type: a?.tipo,
                extra: a?.extra || false,
                extras: p?.extras?.map((e) => {
                    const art = e?.almacen_articulo?.articulo
                    return {
                        id: e?.almacen_articulo_id,
                        name: art?.nombre,
                        cost: e?.costo_con_iva || 0,
                        number: e?.cantidad || 0,
                        comment: e?.comentarios || "",
                        categoryId: art?.categoria_id,
                        category: art?.categoria_articulo?.nombre,
                    }
                }),
            }

            products.push(item)
        })
        return products
    }

    return {
        getClearList,
        getClearOrders,
        getItemsFormat,
        getArticulosForRS,
    }
}
