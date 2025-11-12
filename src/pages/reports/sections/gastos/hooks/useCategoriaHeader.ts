import { useCategoriasGastosForReportQuery } from "src/gql/schema"
import { FlexibleTableHeaderColumn } from "src/shared/components/data-display/FlexibleTable/flexible-table-items.interface"
import { useProfile } from "src/shared/hooks/useProfile"
import { HeaderProps } from "../../hooks/useHeaderProps"

const useCategoriaGastoHeader = <T extends string>({
    headerValue,
    valueToDisplay,
}: HeaderProps<T>): FlexibleTableHeaderColumn => {
    const { hotel_id } = useProfile()

    const { data } = useCategoriasGastosForReportQuery({ variables: { hotel_id } })

    const options = [
        ...(data?.categorias_gasto.map((th) => ({ value: th.categoria_id, valueToDisplay: th.categoria })) || []),
    ]

    return {
        value: headerValue,
        valueToDisplay,
        filterMenu: options,
        isFilterUnique: false,
        filterSuggetions: true,
    }
}

export default useCategoriaGastoHeader
