import { useHabitacionesForReportQuery } from "src/gql/schema"
import { FlexibleTableHeaderColumn } from "src/shared/components/data-display/FlexibleTable/flexible-table-items.interface"
import { useProfile } from "src/shared/hooks/useProfile"
import { HeaderProps } from "./useHeaderProps"

const useHabitacionesHeader = <T extends string>({ headerValue, valueToDisplay }: HeaderProps<T>): FlexibleTableHeaderColumn => {
    const { hotel_id } = useProfile()

    const { data: habitaciones } = useHabitacionesForReportQuery({ variables: { hotel_id } })

    const options = [
        ...(habitaciones?.habitaciones.map((v) => ({
            value: v.numero_habitacion,
            valueToDisplay: v.numero_habitacion,
        })) || []),
    ]

    return {
        value: headerValue,
        valueToDisplay,
        filterMenu: options,
        isFilterUnique: false,
        filterSuggetions: true,
    }
}

export default useHabitacionesHeader
