import { useEffect, useState } from "react"
import { AlmacenArticulo } from "src/gql/schema"
import ArticlesToTable from "../helpers/ArticlesToTable"
import { FlexibleTableRow } from "src/shared/components/data-display/FlexibleTable/flexible-table-items.interface"
import { PathNames } from "../interfaces/pathnames"

const useArticlesTableInitialState = ({ articulos, selectedTableTab }: { articulos?: AlmacenArticulo[], selectedTableTab: PathNames }) => {
    const [tableInitialState, settableInitialState] = useState<FlexibleTableRow[]>([])

    useEffect(() => {
        settableInitialState(ArticlesToTable(articulos || [], selectedTableTab))
    }, [articulos, selectedTableTab])

    return { tableInitialState }
}

export default useArticlesTableInitialState
