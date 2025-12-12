import { FlexibleTableHeaderColumn } from "src/shared/components/data-display/FlexibleTable/flexible-table-items.interface"
import { HeaderProps } from "../../hooks/useHeaderProps"

interface MatriculasHeaderProps<T extends string> extends HeaderProps<T> {
    matriculas?: string[]
}

const useMatriculasHeader = <T extends string>({
    headerValue,
    valueToDisplay,
    matriculas = []
}: MatriculasHeaderProps<T>): FlexibleTableHeaderColumn => {
    return {
        value: headerValue,
        valueToDisplay,
        filterMenu: matriculas.map(m => ({value: m, valueToDisplay: m})),
        isFilterUnique: false,
        filterSuggetions: true,
    }
}

export default useMatriculasHeader
