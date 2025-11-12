import { useState, useEffect } from "react"
import { getDateString } from "src/utils/date"
import { useDate } from "src/shared/hooks/useDate"
import { getCurrencyFormat } from "src/utils/string"

export function useCards(data) {
    const [infoCards, setInfo] = useState<any[]>([])
    const { UTCStringToLocalDate } = useDate()

    const getInfoFormat = (data) => {
        const cards = [
            {
                title: "Unidades en inventario",
                value: data.unidades_inventario + data.unidad,
            },
            {
                title: "Producción por receta",
                value: data.produccion_receta + data.unidad,
            },
            {
                title: "Costo unitario promedio",
                value: getCurrencyFormat(data.costo_unitario_promedio),
            },
            {
                title: "Costo total de inventario",
                value: getCurrencyFormat(data.costo_total_inventario),
            },
            {
                title: "Última producción",
                value: getDateString(UTCStringToLocalDate(data.fecha_ultima_produccion?.split(".")[0])),
            },
        ]

        return cards
    }

    useEffect(() => {
        if (data?.kpis_historial_producciones_inventarios)
            setInfo(getInfoFormat(data?.kpis_historial_producciones_inventarios || []))
    }, [data])

    return {
        infoCards,
    }
}
