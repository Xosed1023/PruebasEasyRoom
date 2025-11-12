import { FlexibleTableHeaderColumn } from "src/shared/components/data-display/FlexibleTable/flexible-table-items.interface"
import { HeaderProps } from "../../hooks/useHeaderProps"

const useTipoEntradaHeader = <T extends string>({
    headerValue,
    valueToDisplay,
}: HeaderProps<T>): FlexibleTableHeaderColumn => {
    return {
        value: headerValue,
        valueToDisplay,
        filterMenu: [
            {
                value: "A pie",
                valueToDisplay: "A pie",
            },
            {
                value: "Auto",
                valueToDisplay: "Auto",
            },
        ],
        isFilterUnique: true,
        filterSuggetions: false,
    }
}

export default useTipoEntradaHeader
