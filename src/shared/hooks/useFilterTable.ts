import { TableRow } from "../components/data-display/table/table-items.interface"

export const useFilterTable = ({
    tableData,
    filters,
}: {
    tableData: TableRow[]
    filters: {
        filter: string
        fromHeader: string
        idx: number
    }[]
}) => {
    return tableData.filter((row) => {
        return filters.some((filter) => {
            const filterValue = filter.filter
            const columnIndex = row.value.findIndex((column) => column.value === filterValue)
            return columnIndex !== -1 && row.value[columnIndex].value === filterValue
        })
    })
}
