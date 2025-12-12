import { PathNames } from "../interfaces/pathnames"
import { AlmacenArticulo } from "src/gql/schema"

const tableFilterByTab = ({
    selectedTab,
    articulos,
}: {
    selectedTab: PathNames
    articulos?: AlmacenArticulo[]
}): AlmacenArticulo[] => {
    return articulos?.filter((art) => {
        if (selectedTab === "Todo") {
            return true
        }
        if (selectedTab === "Alimentos" || selectedTab === "Bebidas") {
            return art.articulo?.categoria_articulo?.nombre === selectedTab
        }
        if (selectedTab === "proceso") {
            return art.articulo?.tipo === selectedTab
        }
    }) as AlmacenArticulo[]
}

export default tableFilterByTab
