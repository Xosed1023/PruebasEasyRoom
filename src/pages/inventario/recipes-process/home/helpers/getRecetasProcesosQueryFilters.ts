import {
    EstadosArticulo,
    Exact,
    InputMaybe,
    PageOptionsArgs,
    Scalars,
    TipoArticulo,
    TipoOrdenamiento,
} from "src/gql/schema"
import { FilterSortState } from "../interfaces/filterSortState"
import { TODOS_CATEGORIA_FILTER } from "../hooks/useGetRecetasProcesos"

export type GetRecetasProps = | Exact<{
    filter_tipo_articulo: Array<TipoArticulo> | TipoArticulo
    pagination_options: PageOptionsArgs
    filterEstadoArticulo?: InputMaybe<EstadosArticulo>
    categoria_articulo_ids?: InputMaybe<Array<Scalars["ID"]["input"]> | Scalars["ID"]["input"]>
    hotel_id: Scalars["ID"]["input"]
    nombreArticuloFilterOrder?: InputMaybe<TipoOrdenamiento>
}>
| undefined

const getRecetasProcesosQueryFilters = ({
    page,
    categoria_tipoSelected,
    categorias_tipo,
    filterSortState,
    hotel_id,
}: {
    page: number
    categoria_tipoSelected: {
        name: string | TipoArticulo.Proceso
        id: string
    }
    categorias_tipo: {
        name: string | TipoArticulo.Proceso
        id: string
    }[]
    filterSortState?: FilterSortState
    hotel_id: string
}): GetRecetasProps => {

        
    const categoriasAlimentosBebidas = categorias_tipo.filter((c) => c.name === "Alimentos" || c.name === "Bebidas")
    
    if (categoria_tipoSelected.name === TODOS_CATEGORIA_FILTER.label) {
        return {
            hotel_id,
            pagination_options: {
                page,
                take: 12,
            },
            ...(filterSortState?.nameSort && filterSortState?.nameSort.sort 
                ? {
                    nombreArticuloFilterOrder:
                        filterSortState?.nameSort.sort === "down" ? TipoOrdenamiento.Asc : TipoOrdenamiento.Desc,
                }
                : {}),
            ...(filterSortState?.estatusFilters ? { filterEstadoArticulo: filterSortState?.estatusFilters } : {}),
            ...(filterSortState?.categoriaFilters
                ? {
                    categoria_articulo_ids: filterSortState.categoriaFilters
                        ? filterSortState?.categoriaFilters.map((f) => f.filter)
                        : categoriasAlimentosBebidas.map((c) => c.id),
                }
                : {}),
            ...(filterSortState?.tipoFilters
                ? { filter_tipo_articulo: filterSortState?.tipoFilters.map((t) => t.filter as TipoArticulo) }
                : { filter_tipo_articulo: [TipoArticulo.Proceso, TipoArticulo.Receta] }),
        }
    }

    if (categoria_tipoSelected.name === "Alimentos" || categoria_tipoSelected.name === "Bebidas") {
        return {
            hotel_id,
            pagination_options: {
                page,
                take: 12,
            },
            ...(filterSortState?.nameSort
                ? {
                    nombreArticuloFilterOrder:
                        filterSortState?.nameSort.sort === "down" ? TipoOrdenamiento.Asc : TipoOrdenamiento.Desc,
                }
                : {}),
            ...(filterSortState?.estatusFilters ? { filterEstadoArticulo: filterSortState?.estatusFilters } : {}),
            categoria_articulo_ids: [categoria_tipoSelected.id],
            filter_tipo_articulo: [TipoArticulo.Receta],
        }
    }

    if (categoria_tipoSelected.name === TipoArticulo.Proceso) {
        return {
            hotel_id,
            pagination_options: {
                page,
                take: 12,
            },
            ...(filterSortState?.nameSort
                ? {
                    nombreArticuloFilterOrder:
                        filterSortState?.nameSort.sort === "down" ? TipoOrdenamiento.Asc : TipoOrdenamiento.Desc,
                }
                : {}),
            ...(filterSortState?.estatusFilters ? { filterEstadoArticulo: filterSortState?.estatusFilters } : {}),
            categoria_articulo_ids: null,
            filter_tipo_articulo: [TipoArticulo.Proceso],
        }
    }

    return undefined
}

export default getRecetasProcesosQueryFilters
