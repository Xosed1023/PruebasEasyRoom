import { FlexibleTableHeaderColumn } from "src/shared/components/data-display/FlexibleTable/flexible-table-items.interface"
import { HeaderProps } from "../../hooks/useHeaderProps"

const useTipoLimpiezaHeader = <T extends string>({
    headerValue,
    valueToDisplay,
}: HeaderProps<T>): FlexibleTableHeaderColumn => {

    return {
        value: headerValue,
        valueToDisplay,
        filterMenu: [
            {value: "Normal", valueToDisplay: "Normal"},
            {value: "Detallada", valueToDisplay: "Detallada"},
            {value: "Retoque", valueToDisplay: "Retoque"},
        ],
        isFilterUnique: false,
        filterSuggetions: false,
    }
}

export default useTipoLimpiezaHeader
