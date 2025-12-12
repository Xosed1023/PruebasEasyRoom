import { useMemo } from "react"
import { FlexibleTableHeaderColumn } from "src/shared/components/data-display/FlexibleTable/flexible-table-items.interface"

export function useTableHeaderHistorialProduccion(data: any[]) {
    const headers: FlexibleTableHeaderColumn[] = useMemo(
        () => [
            {
                value: "#",
                sort: true,
            },
            {
                value: "Fecha de producción",
            },
            {
                value: "Cantidad producida",
            },
            {
                value: "Costo de producción",
            },
            {
                value: "Costo de unidad mínima por producción",
            },
            {
                value: "Responsable",
            },
        ],
        [data]
    )

    return headers
}
