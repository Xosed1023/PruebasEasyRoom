import { FlexibleTableHeaderColumn } from "src/shared/components/data-display/FlexibleTable/flexible-table-items.interface"
import { useProfile } from "src/shared/hooks/useProfile"
import { HeaderProps } from "./useHeaderProps"
import { useColaboradoresPorHotelForReportQuery } from "src/gql/schema"

const useColaboradoresHeader = <T extends string>({ headerValue, valueToDisplay }: HeaderProps<T>): FlexibleTableHeaderColumn => {
    const { hotel_id } = useProfile()
    const { data } = useColaboradoresPorHotelForReportQuery({
        variables: {
            hotel_id,
        },
    })

    const items =
        data?.colaboradores.map((c) => ({
            value: `${c.nombre} ${c.apellido_paterno} ${c.apellido_materno}`,
            valueToDisplay: `${c.nombre} ${c.apellido_paterno} ${c.apellido_materno}`,
        })) || []

    return {
        value: headerValue,
        valueToDisplay,
        filterMenu: items,
        debounceSearchMSTime: 500,
        filterSuggetions: true,
    }
}

export default useColaboradoresHeader
