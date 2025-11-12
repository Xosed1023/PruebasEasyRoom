import { useEffect, useMemo, useState } from "react"
import { AlmacenArticulo, useGetArticulosRoomServiceLazyQuery } from "src/gql/schema"
import useLoadingState from "src/shared/hooks/useLoadingState"
import { useProfile } from "src/shared/hooks/useProfile"

const useArticulosRoomServiceQuery = ({
    filterCategoryId,
    search,
}: {
    filterCategoryId: string[]
    search: string
}) => {
    const [getArticulos] = useGetArticulosRoomServiceLazyQuery()

    const filterCategoryIdStr = filterCategoryId.join()
    
    const { hotel_id } = useProfile()
    const { toggleIsLoading, isLoadingDelayed } = useLoadingState()
    
    const [pagesByCategoryId, setpagesByCategoryId] = useState<{
        [key: string]: { page: number; totalPages: number; almacenes_articulos: AlmacenArticulo[] }
    }>({})

    const currentState = useMemo(
        () =>
            pagesByCategoryId[search ? "search" : filterCategoryIdStr] || {
                almacenes_articulos: [],
                page: 1,
                totalPages: 1,
            },
        [pagesByCategoryId, filterCategoryIdStr, search]
    )

    const loadPage = () => {
        if ((!filterCategoryIdStr && !search) || isLoadingDelayed) return
        const curPage = pagesByCategoryId[search ? "search" : filterCategoryIdStr]

        if(curPage.page >= curPage.totalPages) {
            return
        }

        toggleIsLoading({ value: true })

        getArticulos({
            variables: {
                hotel_id,
                filter_in_categories: search ? null : filterCategoryId,
                pagination_options: {
                    take: 10,
                    page: curPage?.page ? curPage?.page + 1 : 1,
                },
                ...(search ? { nombre_articulo: search } : {}),
            },
        }).then(({ data }) => {
            toggleIsLoading({ value: false })

            setpagesByCategoryId({
                ...pagesByCategoryId,
                [search ? "search" : filterCategoryIdStr]: {
                    page: curPage?.page ? curPage?.page + 1 : 1,
                    totalPages: search
                        ? data?.almacenes_articulos?.paginacion?.total_paginas || 1
                        : pagesByCategoryId[filterCategoryIdStr].totalPages,
                    almacenes_articulos: [
                        ...(curPage?.almacenes_articulos || []),
                        ...((data?.almacenes_articulos?.almacenes_articulos as AlmacenArticulo[]) || []),
                    ],
                },
            })
        })
    }

    useEffect(() => {
        if (
            (pagesByCategoryId[filterCategoryIdStr] &&
                !(pagesByCategoryId?.[filterCategoryIdStr]?.almacenes_articulos?.length < 10)) ||
            !filterCategoryIdStr
        ) {
            return
        }
        toggleIsLoading({ value: true })
        // mostrar array vacío mientras carga la primer página de la lista para mostrar skeleton durante la carga
        setpagesByCategoryId({
            ...pagesByCategoryId,
            [filterCategoryIdStr]: {
                page: 1,
                totalPages: 1,
                almacenes_articulos: [],
            },
        })
        getArticulos({
            variables: {
                hotel_id,
                filter_in_categories: filterCategoryId,
                pagination_options: {
                    take: 10,
                    page: pagesByCategoryId[filterCategoryIdStr]?.page || 1,
                },
                nombre_articulo: null,
            },
        }).then(({ data }) => {
            toggleIsLoading({ value: false })

            setpagesByCategoryId({
                ...pagesByCategoryId,
                [filterCategoryIdStr]: {
                    page: pagesByCategoryId[filterCategoryIdStr]?.page || 1,
                    totalPages: data?.almacenes_articulos?.paginacion?.total_paginas || 1,
                    almacenes_articulos: data?.almacenes_articulos?.almacenes_articulos as AlmacenArticulo[],
                },
            })
        })
    }, [filterCategoryIdStr])

    useEffect(() => {
        if (!search) {
            return
        }

        toggleIsLoading({ value: true })
        setpagesByCategoryId({
            ["search"]: {
                page: 1,
                totalPages: 1,
                almacenes_articulos: [],
            },
        })
        getArticulos({
            variables: {
                hotel_id,
                filter_in_categories: null,
                pagination_options: {
                    take: 10,
                    page: 1,
                },
                ...(search ? { nombre_articulo: search } : {}),
            },
        }).then(({ data }) => {
            toggleIsLoading({ value: false })
            setpagesByCategoryId({
                ["search"]: {
                    page: 1,
                    totalPages: data?.almacenes_articulos?.paginacion?.total_paginas || 1,
                    almacenes_articulos: data?.almacenes_articulos?.almacenes_articulos as AlmacenArticulo[],
                },
            })
        })
    }, [search])

    return {
        almacenArticulos: currentState.almacenes_articulos,
        totalPages: currentState.totalPages,
        currentPage: currentState.page,
        loading: isLoadingDelayed,
        loadPage
    }
}

export default useArticulosRoomServiceQuery
