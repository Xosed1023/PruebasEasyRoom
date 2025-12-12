import { useEffect, useState } from "react"
import { AlmacenArticulo } from "src/gql/schema"
import ArticlesToTable from "../helpers/ArticlesToTable"
import { FlexibleTableRow } from "src/shared/components/data-display/FlexibleTable/flexible-table-items.interface"
import { PathNames } from "../interfaces/pathnames"
import { useFormatDate } from "src/shared/hooks/useFormatDate"

const useArticlesTableInitialState = ({ articulos, selectedTableTab }: { articulos?: AlmacenArticulo[], selectedTableTab: PathNames }) => {
    const [tableInitialState, settableInitialState] = useState<FlexibleTableRow[]>([])
    const { formatCustomDate } = useFormatDate()

    useEffect(() => {
        settableInitialState(ArticlesToTable(articulos || [], selectedTableTab, formatCustomDate))
    }, [articulos, selectedTableTab])

    return { tableInitialState }
}

export default useArticlesTableInitialState
