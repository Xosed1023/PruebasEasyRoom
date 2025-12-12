import { FlexibleTableHeaderColumn } from "src/shared/components/data-display/FlexibleTable/flexible-table-items.interface"
import { HeaderProps } from "../../hooks/useHeaderProps"

const useMovimientoHeader = <T extends string>({
    headerValue,
    valueToDisplay,
}: HeaderProps<T>): FlexibleTableHeaderColumn => {
    return {
        value: headerValue,
        valueToDisplay,
        filterMenu: [
            {
                value: "hora_extra",
                valueToDisplay: "Hora extra",
            },
            {
                value: "hospedaje_extra",
                valueToDisplay: "Hospedaje extra",
            },
            {
                value: "persona_extra",
                valueToDisplay: "Persona extra",
            },
            {
                value: "habitacion",
                valueToDisplay: "Habitación",
            },
        ],
    }
}

export default useMovimientoHeader
