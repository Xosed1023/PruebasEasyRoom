import { useCategoriasArticulosForReportQuery } from "src/gql/schema"
import { FlexibleTableHeaderColumn } from "src/shared/components/data-display/FlexibleTable/flexible-table-items.interface"
import { useProfile } from "src/shared/hooks/useProfile"
import { HeaderProps } from "./useHeaderProps"

const useCategoriasArticulosHeader = <T extends string>({headerValue}:HeaderProps<T>): FlexibleTableHeaderColumn => {
    const { hotel_id } = useProfile()
    const { data } = useCategoriasArticulosForReportQuery   ({
        variables: { hotel_id },
    })

    const options = [
        ...(data?.categorias_articulos.map((th) => ({ value: th.nombre, valueToDisplay: th.nombre })) || []),
    ]

    return {
        value: headerValue,
        filterMenu: options,
        isFilterUnique: false,
        filterSuggetions: false,
    }
}

export default useCategoriasArticulosHeader
