import { FlexibleTableHeaderColumn } from "src/shared/components/data-display/FlexibleTable/flexible-table-items.interface"
import { HeaderProps } from "../../hooks/useHeaderProps"

interface MarcasHeaderProps<T extends string> extends HeaderProps<T> {
    almacenes?: string[]
}

const useAlmacenHeader = <T extends string>({
    headerValue,
    valueToDisplay,
    almacenes = []
}: MarcasHeaderProps<T>): FlexibleTableHeaderColumn => {
    return {
        value: headerValue,
        valueToDisplay,
        filterMenu: almacenes.map(m => ({value: m, valueToDisplay: m})),
        isFilterUnique: false,
        filterSuggetions: true,
    }
}

export default useAlmacenHeader
