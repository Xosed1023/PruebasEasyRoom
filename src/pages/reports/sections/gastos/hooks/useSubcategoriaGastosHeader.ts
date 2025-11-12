import { useEffect } from "react"
import { useSubcategoriasGastosForReportLazyQuery } from "src/gql/schema"
import { FlexibleTableHeaderColumn } from "src/shared/components/data-display/FlexibleTable/flexible-table-items.interface"
import { HeaderProps } from "../../hooks/useHeaderProps"

interface SubCategoriaGastoHeader<T extends string> extends HeaderProps<T> {
    categoria_id?: string[]
}

const useSubCategoriaGastoHeader = <T extends string>({
    headerValue,
    valueToDisplay,
    categoria_id,
}: SubCategoriaGastoHeader<T>): FlexibleTableHeaderColumn => {
    const [getSubcategorias, subcategorias] = useSubcategoriasGastosForReportLazyQuery()

    useEffect(() => {
        if (!categoria_id?.length) {
            return
        }
        getSubcategorias({
            variables: {
                categoria_id,
            },
        })
    }, [categoria_id])

    const options = [
        ...(subcategorias.data?.subcategorias_gasto.map((th) => ({
            value: th.subcategoria,
            valueToDisplay: th.subcategoria,
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

export default useSubCategoriaGastoHeader
