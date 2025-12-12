import { useTiposMttoForReportQuery } from "src/gql/schema"
import { FlexibleTableHeaderColumn } from "src/shared/components/data-display/FlexibleTable/flexible-table-items.interface"
import { useProfile } from "src/shared/hooks/useProfile"
import { HeaderProps } from "../../hooks/useHeaderProps"

const useTipoMttoHeader = <T extends string>({ headerValue, valueToDisplay }: HeaderProps<T>): FlexibleTableHeaderColumn => {
    const { hotel_id } = useProfile()
    const { data } = useTiposMttoForReportQuery({
        variables: {
            hotel_id,
        },
    })

    const items =
        data?.tipos_mantenimiento.map((c) => ({
            value: c.nombre,
            valueToDisplay: c.nombre,
        })) || []

    return {
        value: headerValue,
        valueToDisplay,
        filterMenu: items,
        debounceSearchMSTime: 500,
        filterSuggetions: false,
    }
}

export default useTipoMttoHeader
