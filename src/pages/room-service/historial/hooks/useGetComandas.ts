import { useEffect, useState } from "react"
import { useGetComandasHistorialLazyQuery } from "src/gql/schema"
import { getDateFilters } from "../helpers/filters"
import { useProfile } from "src/shared/hooks/useProfile"
import useLoadingState from "src/shared/hooks/useLoadingState"

const useGetComandas = ({
    page,
    dateFilter,
    numeroOrdenFilter,
    disabled,
    numeroMesa,
}: {
    dateFilter: Date
    page: number
    numeroOrdenFilter: string
    disabled: boolean
    numeroMesa: string | null
}) => {
    const { hotel_id } = useProfile()
    const [getComandas, comandas] = useGetComandasHistorialLazyQuery()
    const { isLoading, toggleIsLoading } = useLoadingState()

    const [totalPaginas, settotalPaginas] = useState(1)

    useEffect(() => {
        if (disabled) {
            return
        }
        toggleIsLoading({ value: true })
        getComandas({
            variables: {
                pagination_options: {
                    page,
                    take: 12,
                },
                hotel_id,
                numero_mesa: numeroMesa  === "todos" ? null : numeroMesa,
                numero_orden: numeroOrdenFilter,
                fecha_registro: getDateFilters(dateFilter),
            },
        }).then((res) => {
            settotalPaginas(res.data?.historial_estados_comanda.paginacion.total_paginas || 1)
            toggleIsLoading({ value: false })
        })
    }, [page, dateFilter, numeroOrdenFilter, disabled, numeroMesa])

    const comandasRes = comandas.data?.historial_estados_comanda.historial_estados_comanda || []

    return { comandas: comandasRes, comandasPages: totalPaginas, isLoading }
}

export default useGetComandas
