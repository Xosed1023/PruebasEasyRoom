import { FlexibleTableHeaderColumn } from "src/shared/components/data-display/FlexibleTable/flexible-table-items.interface"
import { HeaderProps } from "../../hooks/useHeaderProps"

const useStatusHeader = <T extends string>({
    headerValue,
    valueToDisplay,
}: HeaderProps<T>): FlexibleTableHeaderColumn => {
    return {
        value: headerValue,
        valueToDisplay,
        filterMenu: [
            {value: "activa", valueToDisplay: "Activa"},
            {value: "cerrada", valueToDisplay: "Cerrada"},
        ],
        isFilterUnique: true,
        filterSuggetions: true,
    }
}

export default useStatusHeader
