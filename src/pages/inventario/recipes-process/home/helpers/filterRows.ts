import { FlexibleTableItems, FlexibleTableRow } from "src/shared/components/data-display/FlexibleTable/flexible-table-items.interface";
import { TableFilter } from "src/shared/components/data-display/FlexibleTable/FlexibleTable";

export const filterRows = (
    tableState: FlexibleTableItems["rows"],
    selectedFilters: TableFilter[]
): FlexibleTableRow[] => {
    return tableState?.filter((row) => {
        return row.value.every((col, i) => {
            if (!selectedFilters?.length) return true; // No hay filtros, pasamos la fila
            if (!col.filterValue) return true; // La columna no tiene filterValue, pasamos

            // Verificamos si hay un filtro para esta columna
            const matchingFilter = selectedFilters.find(
                (f) => f.idx === i
            );

            // Si no hay filtro correspondiente, no evaluamos esta columna
            if (!matchingFilter) return true;

            // Si hay un filtro correspondiente, verificamos si coincide
            return matchingFilter.filter === col.filterValue;
        });
    });
};