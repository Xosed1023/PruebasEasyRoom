import { useMemo } from "react"
import { tableItems } from "../../data/Gastos.constants"
import { useGastosList } from "../gastos-list/GastosList.hooks"
import { TableSkeleton } from "src/shared/components/layout/skeleton/TableSkeleton/TableSkeleton"
import SkeletonCards from "../gastos-list/SkeletonCard/SkeletonCard"

const ScreenSkeleton = () => {

    const { selectedCategorias, selectedSubCategorias } = useGastosList()

    const headers = useMemo(() => {
        const cateogoriaList: any[] =
            selectedCategorias?.map(({ categoria, categoria_id }) => {
                return {
                    value: categoria_id,
                    valueToDisplay: categoria,
                }
            }) || []

        return [
            {
                value: "#",
            },
            {
                value: "Categoría",
                filterMenu: [
                    {
                        value: "",
                        valueToDisplay: "Todas",
                    },
                    ...cateogoriaList,
                ],
            },
            {
                value: "Subcategoría",
                filterMenu: selectedSubCategorias?.map(({ subcategoria = "", subcategoria_gasto_id = "" }) => {
                    return {
                        value: subcategoria_gasto_id,
                        valueToDisplay: subcategoria,
                    }
                }),
            },
            ...tableItems.headers,
        ]
    }, [selectedCategorias, selectedSubCategorias])

    return (
        <section>
            <div className="gastos-cards">
                <SkeletonCards />
            </div>
            <div className="gastos-table">
                <TableSkeleton headers={headers}/>
            </div>
        </section>
    )
}

export default ScreenSkeleton
