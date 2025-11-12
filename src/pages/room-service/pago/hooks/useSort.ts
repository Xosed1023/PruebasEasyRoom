import { useMemo } from "react"

export function useSort(data: any[]) {
    const getCategoryList = (products: any[]) => {
        const keys: string[] = products.map((a) => a?.almacen_articulo?.articulo?.categoria_articulo?.nombre || "")

        return [...new Set(keys)].map((key) => {
            let total = 0

            products.forEach((a) => {
                if (a?.almacen_articulo?.articulo?.categoria_articulo?.nombre === key) {
                    total += Number(a?.costo_con_iva || 0)
                }
            })
            return {
                label: `${key}`,
                value: total,
            }
        })
    }
    const sort = useMemo(() => {
        if (data[0]?.orden_id) {
            const orders = data.map((i) => ({
                label: i?.orden || "",
                value: i?.total_con_iva || 0,
            }))

            const categoryList = getCategoryList(data.map((a) => a?.detalles_orden).flat(1))
            
            return {
                orders: orders,
                categoryList,
            }
        } else {
            const estancias = data.map((i) => ({
                label: i?.detalle || "",
                value: i?.total || 0,
            }))

            const categoryList = [
                {
                    label: "Estancia",
                    value: data.reduce((total, e) => total + (e?.total || 0), 0),
                },
            ]
            return {
                orders: estancias,
                categoryList,
            }
        }
    }, [data])

    return sort
}