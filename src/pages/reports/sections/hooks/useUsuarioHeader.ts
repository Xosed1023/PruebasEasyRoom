import { FlexibleTableHeaderColumn } from "src/shared/components/data-display/FlexibleTable/flexible-table-items.interface"
import { useProfile } from "src/shared/hooks/useProfile"
import { HeaderProps } from "./useHeaderProps"
import { useUsuariosPorHotelForReportQuery } from "src/gql/schema"

const useUsuarioHeader = <T extends string>({ headerValue, valueToDisplay }: HeaderProps<T>): FlexibleTableHeaderColumn => {
    const { hotel_id } = useProfile()
    const { data } = useUsuariosPorHotelForReportQuery({
        variables: {
            hotel_id,
        },
    })

    const items =
        data?.usuarios.map((c) => ({
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

export default useUsuarioHeader
