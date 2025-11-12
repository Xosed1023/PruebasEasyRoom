import {
    FilterMenuItem,
    FlexibleTableHeaderColumn,
} from "src/shared/components/data-display/FlexibleTable/flexible-table-items.interface"
import { HeaderProps } from "../../hooks/useHeaderProps"

const useIsCajaChicaHeader = <T extends string>({ headerValue, valueToDisplay }: HeaderProps<T>): FlexibleTableHeaderColumn => {
    const options: FilterMenuItem[] = [
        { value: "si", valueToDisplay: "Sí" },
        { value: "no", valueToDisplay: "No" },
    ]

    return {
        value: headerValue,
        valueToDisplay,
        filterMenu: options,
        isFilterUnique: true,
        filterSuggetions: false,
    }
}

export default useIsCajaChicaHeader
