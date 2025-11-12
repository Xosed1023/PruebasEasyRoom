import { CategoriaArticulo, EstadosArticulo, TipoArticulo } from "src/gql/schema"
import { FlexibleTableHeaderColumn } from "src/shared/components/data-display/FlexibleTable/flexible-table-items.interface"
import { PathNames } from "../interfaces/pathnames"

const useTableHeaders = ({
    categoriasArticulos,
    selectedTableTab,
}: {
    categoriasArticulos: CategoriaArticulo[]
    selectedTableTab: PathNames
}): FlexibleTableHeaderColumn[] => {
    return [
        { value: "#" },
        { value: "Receta", sort: true },
        ...(selectedTableTab === "Todo" ? [
            {
                value: "Tipo",
                filterMenu: [
                    { value: TipoArticulo.Receta, valueToDisplay: "Receta" },
                    { value: TipoArticulo.Proceso, valueToDisplay: "Proceso" },
                ],
                isFilterUnique: true,
            }
        ] : []),
        ...(selectedTableTab === "Todo"
            ? [
                {
                    value: "Categoría",
                    filterMenu: categoriasArticulos?.map((cat) => ({
                        value: cat.categoria_id,
                        valueToDisplay: cat.nombre,
                    })),
                    isFilterUnique: true,
                },
            ]
            : []),
        { value: "Última preparación" },
        { value: "Costo" },
        ...(selectedTableTab === TipoArticulo.Proceso ? [] : [{ value: "Precio" }]),
        { value: "Cantidad a producir" },
        { value: "Unidad" },
        {
            value: "Estatus",
            filterMenu: [
                { value: EstadosArticulo.Activado, valueToDisplay: "Activa" },
                { value: EstadosArticulo.Desactivado, valueToDisplay: "Desactivada" },
            ],
            isFilterUnique: true,
        },
    ]
}

export default useTableHeaders
