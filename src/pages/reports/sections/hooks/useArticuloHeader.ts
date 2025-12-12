import { useEffect, useState } from "react"
import { AlmacenArticulo, useSearchArticuloForReportLazyQuery } from "src/gql/schema"
import { FlexibleTableHeaderColumn } from "src/shared/components/data-display/FlexibleTable/flexible-table-items.interface"
import { useProfile } from "src/shared/hooks/useProfile"
import { HeaderProps } from "./useHeaderProps"

const useArticuloHeader = <T extends string>({
    headerValue,
    valueToDisplay,
}: HeaderProps<T>): FlexibleTableHeaderColumn => {
    const [searchArticulo] = useSearchArticuloForReportLazyQuery()
    const [isLoading, setisLoading] = useState(false)
    const { hotel_id } = useProfile()
    const [searchValue, setsearchValue] = useState<null | string>(null)
    const [page, setpage] = useState(1)
    const [pageLimit, setpageLimit] = useState(1)
    const [items, setitems] = useState<AlmacenArticulo[]>([])
    const [startingArticulos, setstartingArticulos] = useState<AlmacenArticulo[]>([])
    const [startingPageLimit, setstartingPageLimit] = useState(1)
    const appendItems = (items: AlmacenArticulo[]) => {
        setitems((list) => [...list, ...items])
    }

    const resetList = () => {
        setpage(1)
        setpageLimit(startingPageLimit)
        setitems(startingArticulos)
        setsearchValue(null)
    }

    useEffect(() => {
        searchArticulo({
            variables: {
                hotel_id,
                nameFilter: null,
                pagination_options: {
                    page: 1,
                    take: 10,
                },
            },
        })
            .then((res) => {
                setstartingArticulos((res.data?.almacenes_articulos.almacenes_articulos as AlmacenArticulo[]) || [])
                setpage(1)
                setstartingPageLimit(res.data?.almacenes_articulos.paginacion.total_paginas || 1)
            })
            .finally(() => {
                setisLoading(false)
            })
    }, [])

    return {
        value: headerValue,
        valueToDisplay,
        onLoadMore: () => {
            if (isLoading) {
                return
            }
            setisLoading(true)
            if (page < pageLimit) {
                searchArticulo({
                    variables: {
                        hotel_id,
                        nameFilter: searchValue,
                        pagination_options: {
                            page: page + 1,
                            take: 10,
                        },
                    },
                })
                    .then((res) => {
                        appendItems((res.data?.almacenes_articulos.almacenes_articulos as AlmacenArticulo[]) || [])
                        setpage((p) => p + 1)
                    })
                    .finally(() => {
                        setisLoading(false)
                    })
            }
        },
        onInputFilterSuggestionChange: (v) => {
            if (!v.value) {
                resetList()
                return
            }
            if (v.headerValue === headerValue) {
                searchArticulo({
                    variables: {
                        hotel_id,
                        nameFilter: v.value,
                        pagination_options: {
                            page: 1,
                            take: 10,
                        },
                    },
                })
                    .then((data) => {
                        setsearchValue(v.value)
                        setitems((data.data?.almacenes_articulos.almacenes_articulos as AlmacenArticulo[]) || [])
                        setpageLimit(data.data?.almacenes_articulos.paginacion.total_paginas || 1)
                    })
                    .finally(() => {
                        setisLoading(false)
                        setpage(1)
                    })
            }
        },
        filterMenu: items.map((i) => ({ value: i.articulo?.nombre || "", valueToDisplay: i.articulo?.nombre || "" })),
        debounceSearchMSTime: 500,
        filterSuggetions: true,
    }
}

export default useArticuloHeader
