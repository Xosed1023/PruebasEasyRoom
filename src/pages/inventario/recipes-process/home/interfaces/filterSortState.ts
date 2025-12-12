import { EstadosArticulo } from "src/gql/schema"
import { SortFilterValue, TableFilter } from "src/shared/components/data-display/FlexibleTable/FlexibleTable"

export interface FilterSortState {
    categoriaFilters?: TableFilter[]
    tipoFilters?: TableFilter[]
    estatusFilters?: EstadosArticulo
    nameSort?: SortFilterValue
}