import { useEffect, useRef, useState } from "react"
import { AlmacenArticulo, useGetArticulosSearchTableLazyQuery } from "src/gql/schema"
import { useProfile } from "src/shared/hooks/useProfile";
import { setArticuloSelected } from "src/store/cocina/cocinaSlice"

const useSearchArticulo = ({ name, page, disabled = false }: { name?: string; page: number, disabled?: boolean }) => {
    const [searchArticulos] = useGetArticulosSearchTableLazyQuery()
    const { hotel_id } = useProfile()

    const nameRef = useRef<string>()
    const timerRef = useRef<NodeJS.Timer>()

    const [articulosFiltered, setarticulosFiltered] = useState<AlmacenArticulo[]>([])

    const [innerPage, setinnerPage] = useState(1)
    const [innerTotalPages, setInnerTotalPages] = useState(1)

    useEffect(() => {
        nameRef.current = name
    }, [name])

    useEffect(() => {
        clearTimeout(timerRef.current)
        if(disabled) {
            return
        }
        timerRef.current = setTimeout(() => {
            if (!name) {
                setinnerPage(1)
                setArticuloSelected([])
                return
            }
            searchArticulos({
                variables: {
                    hotel_id,
                    nameFilter: nameRef.current || "",
                    pagination_options: {
                        page: page,
                        take: 10,
                    },
                },
            }).then((d) => {
                setinnerPage(d.data?.almacenes_articulos.paginacion.pagina_actual || 1)
                setInnerTotalPages(d.data?.almacenes_articulos.paginacion.total_paginas || 1)
                setarticulosFiltered((d.data?.almacenes_articulos.almacenes_articulos as AlmacenArticulo[]) || [])
            })
        }, 300)
    }, [name, disabled])

    useEffect(() => {
        if (page >= innerTotalPages || !name) {
            return
        }
        searchArticulos({
            variables: {
                nameFilter: name || "",
                pagination_options: {
                    page: innerPage + 1,
                    take: 10,
                },
            },
        }).then((d) => {
            setinnerPage(d.data?.almacenes_articulos.paginacion.pagina_actual || 1)
            setarticulosFiltered((v) => [
                ...v,
                ...(d.data?.almacenes_articulos.almacenes_articulos as AlmacenArticulo[]),
            ])
        })
    }, [page])

    return {
        articulosFiltered,
    }
}

export default useSearchArticulo
