import { FlexibleTableHeaderColumn } from "src/shared/components/data-display/FlexibleTable/flexible-table-items.interface"
import { HeaderProps } from "./useHeaderProps"
import { usePuestosForReportQuery } from "src/gql/schema"

const usePuestosHeader = <T extends string>({ headerValue, valueToDisplay }: HeaderProps<T>): FlexibleTableHeaderColumn => {
    const { data } = usePuestosForReportQuery()

    const items =
        data?.puestos.map((c) => ({
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

export default usePuestosHeader
