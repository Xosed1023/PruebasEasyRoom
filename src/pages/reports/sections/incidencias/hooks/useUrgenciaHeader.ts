import { FlexibleTableHeaderColumn } from "src/shared/components/data-display/FlexibleTable/flexible-table-items.interface"
import { HeaderProps } from "../../hooks/useHeaderProps"

const useUrgenciaHeader = <T extends string>({
    headerValue,
    valueToDisplay,
}: HeaderProps<T>): FlexibleTableHeaderColumn => {
    return {
        value: headerValue,
        valueToDisplay,
        filterMenu: [
            { valueToDisplay: "Alta", value: "Alta" },
            { valueToDisplay: "Media", value: "Media" },
            { valueToDisplay: "Baja", value: "Baja" },
        ],
        isFilterUnique: false,
        filterSuggetions: true,
    }
}

export default useUrgenciaHeader
