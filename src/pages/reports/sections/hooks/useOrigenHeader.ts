import { useTipos_HabitacionesForReportQuery } from "src/gql/schema"
import { FlexibleTableHeaderColumn } from "src/shared/components/data-display/FlexibleTable/flexible-table-items.interface"
import { useProfile } from "src/shared/hooks/useProfile"
import { HeaderProps } from "./useHeaderProps"

const useOrigenHeader = <T extends string>({headerValue, valueToDisplay}: HeaderProps<T>): FlexibleTableHeaderColumn => {
    const { hotel_id } = useProfile()
    const { data } = useTipos_HabitacionesForReportQuery({
        variables: { hotel_id },
    })

    const options = [
        { value: "Mostrador", valueToDisplay: "Mostrador" },
        { value: "Mesa", valueToDisplay: "Mesa" },
        ...(data?.tipo_habitaciones.map((th) => ({ value: th.nombre, valueToDisplay: th.nombre })) || []),
    ]

    return {
        value: headerValue,
        valueToDisplay,
        filterMenu: options,
        isFilterUnique: false,
        filterSuggetions: false,
    }
}

export default useOrigenHeader
