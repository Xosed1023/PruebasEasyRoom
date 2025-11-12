import { FlexibleTableHeaderColumn } from "src/shared/components/data-display/FlexibleTable/flexible-table-items.interface"
import { useProfile } from "src/shared/hooks/useProfile"
import { HeaderProps } from "./useHeaderProps"
import { useAreasForReportQuery } from "src/gql/schema"

const useAreasHeader = <T extends string>({ headerValue, valueToDisplay }: HeaderProps<T>): FlexibleTableHeaderColumn => {
    const { hotel_id } = useProfile()
    const { data } = useAreasForReportQuery({
        variables: {
            hotel_id,
        },
    })

    const items =
        data?.areas.map((c) => ({
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

export default useAreasHeader
