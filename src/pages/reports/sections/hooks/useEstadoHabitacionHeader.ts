import { Estados_Habitaciones } from "src/gql/schema"
import { FlexibleTableHeaderColumn } from "src/shared/components/data-display/FlexibleTable/flexible-table-items.interface"
import { HeaderProps } from "./useHeaderProps"

const useEstadoHabitacionHeader = <T extends string>({headerValue, valueToDisplay}:HeaderProps<T>): FlexibleTableHeaderColumn => {

    const options = [
        {value: Estados_Habitaciones.Ocupada, valueToDisplay: "Ocupada"},
        {value: Estados_Habitaciones.Sucia, valueToDisplay: "Sucia"},
        {value: Estados_Habitaciones.ALaVenta, valueToDisplay: "A la venta"},
        {value: Estados_Habitaciones.Bloqueada, valueToDisplay: "Bloqueada"},
        {value: Estados_Habitaciones.Limpieza, valueToDisplay: "En limpieza"},
        {value: Estados_Habitaciones.Preparada, valueToDisplay: "Preparada"},
        {value: Estados_Habitaciones.Reservada, valueToDisplay: "Reservada"},
        {value: Estados_Habitaciones.Supervision, valueToDisplay: "Supervisión"},
        {value: Estados_Habitaciones.SupervisionPendiente, valueToDisplay: "Supervisión pendiente"},
        {value: Estados_Habitaciones.Mantenimiento, valueToDisplay: "Mantenimiento"},
    ]

    return {
        value: headerValue,
        valueToDisplay,
        filterMenu: options,
        isFilterUnique: false,
        filterSuggetions: true,
    }
}

export default useEstadoHabitacionHeader
