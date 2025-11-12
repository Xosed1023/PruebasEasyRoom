import { FlexibleTableHeaderColumn } from "src/shared/components/data-display/FlexibleTable/flexible-table-items.interface"
import { HeaderProps } from "../../hooks/useHeaderProps"

interface MarcasHeaderProps<T extends string> extends HeaderProps<T> {
    modelos?: string[]
}

const useMarcasHeader = <T extends string>({
    headerValue,
    valueToDisplay,
    modelos = []
}: MarcasHeaderProps<T>): FlexibleTableHeaderColumn => {
    return {
        value: headerValue,
        valueToDisplay,
        filterMenu: modelos.map(m => ({value: m, valueToDisplay: m})),
        isFilterUnique: false,
        filterSuggetions: true,
    }
}

export default useMarcasHeader
