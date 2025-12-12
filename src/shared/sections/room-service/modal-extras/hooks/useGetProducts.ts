import { useEffect, useState } from "react"
import { AlmacenArticulo, useGetArticulosRoomServiceLazyQuery, useGetCategoriasRsQuery } from "src/gql/schema"
import { useProfile } from "src/shared/hooks/useProfile"

const useGetProducts = ({ page, categorySelected }: { page: number; categorySelected: string }) => {
    const { hotel_id } = useProfile()

    const { data: categorias_articulos } = useGetCategoriasRsQuery({
        variables: { hotel_id },
        fetchPolicy: "cache-first",
    })

    const [getArticulos] = useGetArticulosRoomServiceLazyQuery()

    const [products, setProducts] = useState<{
        [key: string]: { page: number; totalPages: number; products: AlmacenArticulo[] }
    }>({})

    useEffect(() => {
        if (!categorias_articulos?.categorias_articulos) {
            return
        }
        getArticulos({
            variables: {
                hotel_id,
                filter_in_categories:
                    categorySelected === "todas"
                        ? categorias_articulos?.categorias_articulos.map((c) => c.categoria_id) || []
                        : [categorySelected],
                pagination_options: {
                    page: 1,
                    take: 10,
                },
            },
            fetchPolicy: "no-cache",
        }).then((data) => {
            setProducts({
                [categorySelected]: {
                    page: data.data?.almacenes_articulos.paginacion.pagina_actual || 1,
                    totalPages: data.data?.almacenes_articulos.paginacion.total_paginas || 1,
                    products: (data.data?.almacenes_articulos.almacenes_articulos as AlmacenArticulo[]) || [],
                },
            })
        })
    }, [categorias_articulos, categorySelected])

    useEffect(() => {
        if (!categorias_articulos?.categorias_articulos || page === 1) {
            return
        }
        getArticulos({
            variables: {
                hotel_id,
                filter_in_categories: categorias_articulos?.categorias_articulos.map((c) => c.categoria_id) || [],
                pagination_options: {
                    page,
                    take: 10,
                },
            },
            fetchPolicy: "no-cache",
        }).then((data) => {
            setProducts({
                [categorySelected]: {
                    page: data.data?.almacenes_articulos.paginacion.pagina_actual || 1,
                    totalPages: data.data?.almacenes_articulos.paginacion.total_paginas || 1,
                    products: [
                        ...(products[categorySelected]?.products || []),
                        ...((data.data?.almacenes_articulos.almacenes_articulos as AlmacenArticulo[]) || []),
                    ],
                },
            })
        })
    }, [page])

    return {
        products: products[categorySelected]?.products || [],
        categories: categorias_articulos?.categorias_articulos || [],
    }
}

export default useGetProducts
