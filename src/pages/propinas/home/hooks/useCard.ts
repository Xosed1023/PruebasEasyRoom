import { useMemo } from "react"

export function useCardList(data: any[]) {
    const list = useMemo(() => {
        let total = 0
        let totalRs = 0
        let totalRestaurante = 0
        let totalRenta = 0
        let totalOtros = 0
        let totalTarjetas = 0
        let totalEfectivo = 0

        data?.forEach((item) => {
            if (!item?.eliminado) {
                const propina = Number(item?.total || 0)
                total += propina

                if (item?.procedencia === "roomservice") {
                    totalRs += propina
                } else if (item?.procedencia === "renta") {
                    totalRenta += propina
                } else if (item?.procedencia === "restaurante") {
                    totalRestaurante += propina
                } else {
                    totalOtros += propina
                }

                item?.detalles_pago?.forEach((p) => {
                    const subtotal = Number(p?.subtotal || 0)
                    if (p?.tipo_pago === "efectivo") {
                        totalEfectivo += subtotal
                    } else {
                        totalTarjetas += subtotal
                    }
                })
            }
        })

        return {
            cards: [
                { title: "Total propinas recaudadas", percent: undefined, value: total },
                { title: "", percent: undefined, value: 0 },
                { title: "", percent: Math.round((Number(totalRs + totalRestaurante) * 100) / total), value: 0 },
                { title: "Venta de habitación", percent: Math.round((totalRenta * 100) / total), value: totalRenta },
                { title: "Otra", percent: Math.round((totalOtros * 100) / total), value: totalOtros },
            ],
            items: [
                { label: "Efectivo", value: totalEfectivo },
                { label: "Tarjetas", value: totalTarjetas },
            ],
            items_rs: [
                { label: "Room Service", value: totalRs },
                { label: "Restaurante/Bar", value: totalRestaurante },
            ],
        }
    }, [data])

    return list
}
