import { TipoArticulo, useGetRecetasProcesosLazyQuery } from "src/gql/schema"
import { useEffect, useMemo, useRef, useState } from "react"
import { AlmacenArticulo } from "src/gql/schema"
import { useProfile } from "src/shared/hooks/useProfile"
import { FilterSortState } from "../interfaces/filterSortState"
import getRecetasProcesosQueryFilters from "../helpers/getRecetasProcesosQueryFilters"
import { PathNames } from "../interfaces/pathnames"

export const TODOS_CATEGORIA_FILTER = { label: "Todo", value: "" }

const useGetRecetasProcesos = ({
    page,
    categoria_tipoSelected,
    categorias_tipo,
    filterSortState,
    articleFromSearch,
}: {
    articleFromSearch?: AlmacenArticulo | null
    page: number
    categoria_tipoSelected: {
        name: PathNames | TipoArticulo.Proceso
        id: string
    }
    categorias_tipo: {
        name: PathNames | TipoArticulo.Proceso
        id: string
    }[]
    filterSortState?: FilterSortState
}) => {
    const [getRecetasProcesos] = useGetRecetasProcesosLazyQuery()
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
            articleFromSearch
                ? {
                    articulos: [articleFromSearch],
                    currentPage: page,
                    totalPages: 1,
                }
                : articleFromSearch === null
                ? {
                    articulos: [],
                    currentPage: page,
                    totalPages: 1,
                }
                : articulos?.[categoria_tipoSelected.name]?.[page] || {
                    articulos: [],
                    currentPage: page,
                    totalPages: articulos?.[categoria_tipoSelected.name]?.[page]?.totalPages || 1,
                },
        [page, categoria_tipoSelected, articulos, articleFromSearch]
    )

    useEffect(() => {
        if (
            articulosRef.current?.[categoria_tipoSelected?.name]?.[page] ||
            !categorias_tipo.length ||
            !categoria_tipoSelected.name
        ) {
            return
        }
        setisLoading(true)
        getRecetasProcesos({
            variables: getRecetasProcesosQueryFilters({
                categoria_tipoSelected: categoria_tipoSelected,
                categorias_tipo,
                hotel_id,
                page,
                filterSortState,
            }),
        }).then((data) => {
            if (!data.data?.almacenes_articulos) {
                return
            }
            const updatedArticulos = {
                ...articulos,
                [categoria_tipoSelected.name]: {
                    ...articulos?.[categoria_tipoSelected.name],
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
    }, [page, filterSortState, categorias_tipo])

    useEffect(() => {
        if (
            articulosRef.current?.[categoria_tipoSelected.name]?.[page] ||
            !categorias_tipo.length ||
            !categoria_tipoSelected.name
        ) {
            return
        }
        setisLoading(true)
        getRecetasProcesos({
            variables: getRecetasProcesosQueryFilters({
                categoria_tipoSelected: categoria_tipoSelected,
                categorias_tipo,
                hotel_id,
                page,
                filterSortState,
            }),
        }).then((data) => {
            if (!data.data?.almacenes_articulos) {
                return
            }

            const updatedArticulos = {
                ...articulos,
                [categoria_tipoSelected.name]: {
                    ...articulos?.[categoria_tipoSelected.name],
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
    }, [categoria_tipoSelected, categorias_tipo])

    const refetch = async ({ almacenSelected, page }: { almacenSelected: string; page: number }) => {
        setisLoading(true)
        return await getRecetasProcesos({
            variables: getRecetasProcesosQueryFilters({
                categoria_tipoSelected: categoria_tipoSelected,
                categorias_tipo,
                hotel_id,
                page,
                filterSortState,
            }),
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
        refetch,
        currentPage: articulosToShow.currentPage,
        totalPages: articulosToShow.totalPages,
        isLoading,
    }
}

export default useGetRecetasProcesos
