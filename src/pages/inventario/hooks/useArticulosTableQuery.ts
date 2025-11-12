import { useEffect, useMemo, useRef, useState } from "react"
import {
    AlmacenArticulo,
    EstadosAlmacenesArticulos,
    EstadosArticulo,
    Order,
    TipoArticulo,
    TipoOrdenamiento,
    useTableArticulosLazyQuery,
} from "src/gql/schema"
import { useProfile } from "src/shared/hooks/useProfile"
import { FilterSortState, TODOS_ALMACEN_FILTER } from ".."

const useArticulosTableQuery = ({
    page,
    almacenSelected,
    almacenes,
    filterSortState,
}: {
    page: number
    almacenSelected: string
    almacenes: string[]
    filterSortState?: FilterSortState
}) => {
    const [getArticulos] = useTableArticulosLazyQuery()
    const { hotel_id } = useProfile()

    const [isLoading, setisLoading] = useState(true)
    const [articulos, setarticulos] = useState<{
        [key: string]: {
            [key: number]: { articulos: AlmacenArticulo[]; totalPages: number; currentPage: number }
        }
    }>({})

    const articulosRef = useRef<{
        [key: string]: {
            [key: number]: { articulos: AlmacenArticulo[]; totalPages: number; currentPage: number }
        }
    }>({})

    useEffect(() => {
        setarticulos({})
        articulosRef.current = {}
    }, [filterSortState])

    const articulosToShow = useMemo(
        () =>
            articulos?.[almacenSelected]?.[page] || {
                articulos: [],
                currentPage: page || 1,
                totalPages: articulos?.[almacenSelected]?.[1]?.totalPages || 1,
            },
        [page, almacenSelected, articulos]
    )

    useEffect(() => {
        if (articulosRef.current?.[almacenSelected]?.[page] || !almacenes.length || !almacenSelected) {
            return
        }
        setisLoading(true)
        getArticulos({
            variables: {
                hotel_id,
                almacen_id: filterSortState?.almacenFilters?.filter(f => f.filter.length).length ? filterSortState?.almacenFilters.map(f => f.filter) : almacenSelected === TODOS_ALMACEN_FILTER.label ? almacenes : [almacenSelected],
                pagination_options: {
                    take: 12,
                    page,
                    ...(filterSortState?.nameSort?.sort ? {} : {order: Order.Asc}),
                },
                filter_tipo_articulo: filterSortState?.tipoFilters?.filter((t) => t.filter).length
                    ? filterSortState.tipoFilters.map((t) => t.filter.toLowerCase() as TipoArticulo)
                    : [TipoArticulo.Insumo, TipoArticulo.Proceso, TipoArticulo.Venta],
                ...(filterSortState?.nameSort && filterSortState?.nameSort.sort 
                    ? {
                        nombreArticuloFilterOrder:
                            filterSortState.nameSort.sort === "up" ? TipoOrdenamiento.Asc : TipoOrdenamiento.Desc,
                    }
                    : {}),
                ...(filterSortState?.disponibilidadFilters?.filter(f => f.filter.length).length ?
                filterSortState?.disponibilidadFilters?.some(
                    (f) => f.filter === EstadosArticulo.Activado || f.filter === EstadosArticulo.Desactivado
                )
                    ? {
                        filterEstadoArticulo: filterSortState?.disponibilidadFilters[0].filter as EstadosArticulo,
                    }
                    : {
                        filterEstadoAlmacenArticulo: filterSortState?.disponibilidadFilters?.[0]
                            .filter as EstadosAlmacenesArticulos,
                    } : {}),
            },
        }).then((data) => {
            if (!data.data?.almacenes_articulos) {
                return
            }
            const updatedArticulos = {
                ...articulos,
                [almacenSelected]: {
                    ...articulos?.[almacenSelected],
                    [page]: {
                        currentPage: data.data.almacenes_articulos.paginacion.pagina_actual,
                        totalPages: data.data.almacenes_articulos.paginacion.total_paginas,
                        articulos: (data.data?.almacenes_articulos.almacenes_articulos as AlmacenArticulo[]) || [],
                    },
                },
            }
            setarticulos(updatedArticulos)
            articulosRef.current = updatedArticulos
            setisLoading(false)
        })
    }, [page, almacenes, filterSortState])

    useEffect(() => {
        if (articulosRef.current?.[almacenSelected]?.[page] || !almacenes.length || !almacenSelected) {
            return
        }
        setisLoading(true)
        getArticulos({
            variables: {
                hotel_id,
                almacen_id: almacenSelected === TODOS_ALMACEN_FILTER.label ? almacenes : [almacenSelected],
                pagination_options: {
                    take: 12,
                    page: 1,
                    order: Order.Asc,
                },
            },
        }).then((data) => {
            if (!data.data?.almacenes_articulos) {
                return
            }
            const updatedArticulos = {
                ...articulos,
                [almacenSelected]: {
                    ...articulos?.[almacenSelected],
                    [page]: {
                        currentPage: data.data.almacenes_articulos.paginacion.pagina_actual,
                        totalPages: data.data.almacenes_articulos.paginacion.total_paginas,
                        articulos: (data.data?.almacenes_articulos.almacenes_articulos as AlmacenArticulo[]) || [],
                    },
                },
            }
            setarticulos(updatedArticulos)
            articulosRef.current = updatedArticulos
            setisLoading(false)
        })
    }, [almacenSelected, almacenes])

    const refecth = async ({ almacenSelected, page }: { almacenSelected: string; page: number }) => {
        setisLoading(true)
        return await getArticulos({
            variables: {
                hotel_id,
                almacen_id: almacenSelected === TODOS_ALMACEN_FILTER.label ? almacenes : [almacenSelected],
                pagination_options: {
                    take: 12,
                    page,
                    order: Order.Desc,
                },
            },
        }).then((data) => {
            if (!data.data?.almacenes_articulos) {
                return
            }
            const articulosUpdated = {
                ...articulos,
                [almacenSelected]: {
                    ...articulos?.[almacenSelected],
                    [page]: {
                        currentPage: data.data.almacenes_articulos.paginacion.pagina_actual,
                        totalPages: data.data.almacenes_articulos.paginacion.total_paginas,
                        articulos: (data.data?.almacenes_articulos.almacenes_articulos as AlmacenArticulo[]) || [],
                    },
                },
            }
            setarticulos(articulosUpdated)
            articulosRef.current = articulosUpdated
            setisLoading(false)
        })
    }

    return {
        articulos: articulosToShow.articulos,
        refecth,
        currentPage: articulosToShow.currentPage,
        totalPages: articulosToShow.totalPages,
        isLoading,
    }
}

export default useArticulosTableQuery
