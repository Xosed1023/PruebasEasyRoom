import { FlexibleTableHeaderColumn } from "src/shared/components/data-display/FlexibleTable/flexible-table-items.interface"
import { HeaderProps } from "../../hooks/useHeaderProps"

const useTipoHeader = <T extends string>({
    headerValue,
    valueToDisplay,
}: HeaderProps<T>): FlexibleTableHeaderColumn => {
    return {
        value: headerValue,
        valueToDisplay,
        filterMenu: [
            { valueToDisplay: "Mal comportamiento", value: "Mal comportamiento" },
            { valueToDisplay: "Daño a instalaciones", value: "Daño a instalaciones" },
            { valueToDisplay: "Objeto olvidado", value: "Objeto olvidado" },
            { valueToDisplay: "Limpieza", value: "Limpieza" },
            { valueToDisplay: "Mantenimiento", value: "Mantenimiento" },
        ],
        isFilterUnique: false,
        filterSuggetions: true,
    }
}

export default useTipoHeader
