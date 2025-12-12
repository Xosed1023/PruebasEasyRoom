import { FlexibleTableHeaderColumn } from "src/shared/components/data-display/FlexibleTable/flexible-table-items.interface"
import { HeaderProps } from "../../hooks/useHeaderProps"

const useOrigenHeader = <T extends string>({
    headerValue,
    valueToDisplay,
}: HeaderProps<T>): FlexibleTableHeaderColumn => {
    return {
        value: headerValue,
        valueToDisplay,
        filterMenu: [
            {
                value: "renta",
                valueToDisplay: "Renta",
            },
            {
                value: "reserva",
                valueToDisplay: "Reserva",
            },
        ],
        debounceSearchMSTime: 500,
        filterSuggetions: true,
    }
}

export default useOrigenHeader
