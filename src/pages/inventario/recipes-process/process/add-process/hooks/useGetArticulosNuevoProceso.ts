import { useEffect, useMemo, useRef, useState } from "react"
import { AlmacenArticulo, useArticulosNuevaRecetaProcesoLazyQuery } from "src/gql/schema"
import { useProfile } from "src/shared/hooks/useProfile"

const useGetArticulosNuevoProceso = () => {
    const { hotel_id } = useProfile()
    const [page, setpage] = useState(1)
    const [articulos, setarticulos] = useState<AlmacenArticulo[]>([])
    const [loadArticulosProceso] = useArticulosNuevaRecetaProcesoLazyQuery()
    const [isLoading, setisLoading] = useState(false)

    const timer = useRef<NodeJS.Timer>()

    const pageRef = useRef(1)
    const totalPages = useRef(1)

    useEffect(() => {
        pageRef.current = page
    }, [page])

    const loadArticulos = (name: string) => {
        clearTimeout(timer.current)
        if (isLoading) {
            return
        }
        timer.current = setTimeout(() => {
            setpage(1)
            setarticulos([])
            if(!name) {
                return
            }
            setisLoading(true)
            loadArticulosProceso({
                variables: {
                    nameFilter: name,
                    pagination_options: {
                        page: 1,
                        take: 12,
                    },
                    hotel_id,
                },
            })
                .then((d) => {
                    totalPages.current = d.data?.almacenes_articulos.paginacion.total_paginas || 1
                    setarticulos((d.data?.almacenes_articulos.almacenes_articulos as AlmacenArticulo[]) || [])
                })
                .finally(() => {
                    setisLoading(false)
                })
        }, 300)
    }


    const articulosToShow = useMemo(() => articulos, [articulos])
    

    const loadArticulosPage = (name: string) => {
        if (isLoading) {
            return
        }
        if(pageRef.current + 1 >= (totalPages.current || 1)) {
            return
        }
        setisLoading(true)
        loadArticulosProceso({
            variables: {
                nameFilter: name,
                pagination_options: {
                    page: pageRef.current + 1,
                    take: 12,
                },
                hotel_id,
            },
        })
            .then((d) => {
                totalPages.current = d.data?.almacenes_articulos.paginacion.total_paginas || 1
                setarticulos(art => [
                    ...art,
                    ...((d.data?.almacenes_articulos.almacenes_articulos as AlmacenArticulo[]) || []),
                ])
                setpage((p) => p + 1)
            })
            .finally(() => {
                setisLoading(false)
            })
    }

    return { articulos: articulosToShow, isLoading, loadArticulos, loadArticulosPage }
}

export default useGetArticulosNuevoProceso
