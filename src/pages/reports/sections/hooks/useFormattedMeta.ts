import { useMemo } from "react"
import { SortFilterValue, TableFilter } from "src/shared/components/data-display/FlexibleTable/FlexibleTable"

const useFormattedMeta = <T extends string>({
    sortValue,
    filterValues,
    headerValues,
}: {
    sortValue: SortFilterValue | null
    filterValues: TableFilter[] | null
    headerValues: T[]
}) => {
    const formattedMeta = useMemo(() => {
        if(!sortValue && !filterValues) {
            return null
        }
        const meta: Record<string, any> = {}

        // --- ORDEN ---
        if (sortValue && sortValue.sort !== null && headerValues.includes(sortValue.fromHeader as T)) {
            meta.orden = {
                [sortValue.fromHeader]: sortValue.sort === "up" ? "asc" : "desc",
            }
        }

        // --- FILTRO ---
        if (filterValues?.length) {
            const filtro: Record<string, any> = {}

            headerValues.forEach((header) => {
                const filtersForHeader = filterValues.filter((f) => f.fromHeader === header)
                if (filtersForHeader.length > 0) {
                    filtro[header] = filtersForHeader.map((f) => f.filter)
                }
            })

            if (Object.keys(filtro).length > 0) {
                meta.filtro = filtro
            }
        }

        return meta
    }, [sortValue, filterValues, headerValues])

    return { formattedMeta }
}

export default useFormattedMeta
