import { FlexibleTableHeaderColumn } from "src/shared/components/data-display/FlexibleTable/flexible-table-items.interface"
import { HeaderProps } from "../../hooks/useHeaderProps"

const useTipoMovimientoHeader = <T extends string>({
    headerValue,
    valueToDisplay,
}:  HeaderProps<T>): FlexibleTableHeaderColumn => {
    return {
        value: headerValue,
        valueToDisplay,
        filterMenu: [
            {value: "venta", valueToDisplay: "Venta"},
            {value: "proceso", valueToDisplay: "Proceso"},
            {value: "insumo", valueToDisplay: "Insumo"},
            {value: "resurtido", valueToDisplay: "Resurtido"},
        ],
        isFilterUnique: false,
        filterSuggetions: false,
    }
}

export default useTipoMovimientoHeader
