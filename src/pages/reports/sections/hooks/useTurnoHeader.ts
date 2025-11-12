import { useTurnosForReportQuery } from "src/gql/schema"
import { FlexibleTableHeaderColumn } from "src/shared/components/data-display/FlexibleTable/flexible-table-items.interface"
import { useProfile } from "src/shared/hooks/useProfile"
import { HeaderProps } from "./useHeaderProps"

const useTurnoHeader = <T extends string>({headerValue, valueToDisplay}: HeaderProps<T>): FlexibleTableHeaderColumn => {
    const { hotel_id } = useProfile()
    const { data } = useTurnosForReportQuery({
        variables: { hotel_id: [hotel_id] },
    })

    const options = [...(data?.turnos.map((t) => ({ value: t.nombre, valueToDisplay: t.nombre })) || [])]

    return {
        value: headerValue,
        valueToDisplay,
        filterMenu: options,
        isFilterUnique: false,
        filterSuggetions: false,
    }
}

export default useTurnoHeader
