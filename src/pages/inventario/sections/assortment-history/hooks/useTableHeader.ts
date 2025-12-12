import { useMemo } from "react"
import { TiposSurtido } from "src/gql/schema"
import { FlexibleTableHeaderColumn } from "src/shared/components/data-display/FlexibleTable/flexible-table-items.interface"

const ITEM_ALL = { value: "todos", valueToDisplay: "Todos" }

export function useTableHeader(data: any[]) {

    const getFilterOptions = (key: string) => {
        const options: any[] = []

        data?.forEach((item) => {
            const value = item?.[key]
            if (value) {
                const find = options.find((item) => item?.value === value)
                if (!find) options.push({ value, valueToDisplay: value })
            }
        })

        return options.length > 0 ? [ITEM_ALL, ...options] : []
    }

    const headers: FlexibleTableHeaderColumn[] = useMemo(()=>[
        {
            value: "#",
            filterMenu: getFilterOptions("folio")
        },
        {
            value: "Fecha de surtido",
        },
        {
            value: "Tipo",
            filterMenu: [
                ITEM_ALL,
                {
                    value: TiposSurtido.Surtido,
                    valueToDisplay: "Surtido",
                },
                {
                    value: TiposSurtido.Transferencia,
                    valueToDisplay: "Transferencia",
                }
            ]
        },
        {
            value: "Cantidad",
        },
        {
            value: "Costo de unidad",
        },
        {
            value: "Costo de surtido",
        },
        {
            value: "Orden de compra",
        },
        {
            value: "Responsable",
        },
    ], [data])

    return headers 
}