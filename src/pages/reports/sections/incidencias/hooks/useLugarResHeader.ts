import { FlexibleTableHeaderColumn } from "src/shared/components/data-display/FlexibleTable/flexible-table-items.interface"
import { HeaderProps } from "../../hooks/useHeaderProps"

const useLugarResHeader = <T extends string>({
    headerValue,
    valueToDisplay,
}: HeaderProps<T>): FlexibleTableHeaderColumn => {
    return {
        value: headerValue,
        valueToDisplay,
        filterMenu: [
            { valueToDisplay: "Instalaciones", value: "instalaciones" },
            { valueToDisplay: "Habitación", value: "habitación" },
            { valueToDisplay: "Huésped", value: "huésped" },
        ],
        isFilterUnique: false,
        filterSuggetions: true,
    }
}

export default useLugarResHeader
