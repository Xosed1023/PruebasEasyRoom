import { CategoriaArticulo, GetAggregationsAlmacenesArticulosOutput, TipoArticulo } from "src/gql/schema"
import { TabList } from "src/shared/components/navigation/tab-menu/TabMenu.types"

const useArticlesTabs = ({
    categoriasAlimentosBebidas,
    counters
}: {
    counters?: GetAggregationsAlmacenesArticulosOutput
    categoriasAlimentosBebidas?: CategoriaArticulo[]
}): TabList[] => {
    return [
        {
            label: "Todo",
            path: "Todo",
            number: counters?.total_recetas_procesos || 0,
        },
        ...(categoriasAlimentosBebidas?.map((cat) => ({
            label: cat.nombre,
            path: cat.nombre,
            number: cat.nombre === "Alimentos" ? counters?.total_recetas_alimentos || 0 : counters?.total_recetas_bebidas || 0,
        })) || []),
        {
            label: "Procesos",
            path: TipoArticulo.Proceso,
            number: counters?.total_procesos || 0
        },
    ]
}

export default useArticlesTabs
