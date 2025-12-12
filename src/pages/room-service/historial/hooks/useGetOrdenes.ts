import { useEffect, useState } from "react"
import { TipoOrden, useGetOrdenesHistorialLazyQuery } from "src/gql/schema"
import { getDateFilters } from "../helpers/filters"
import { useProfile } from "src/shared/hooks/useProfile"
import useLoadingState from "src/shared/hooks/useLoadingState"

const useGetOrdenes = ({
    page,
    dateFilter,
    origenFilter,
    numeroOrdenFilter,
    disabled,
}: {
    dateFilter: Date
    page: number
    origenFilter: TipoOrden
    numeroOrdenFilter: string
    disabled: boolean
}) => {
    const { hotel_id } = useProfile()
    const [getOrdenes, ordenes] = useGetOrdenesHistorialLazyQuery()
    const { isLoading, toggleIsLoading } = useLoadingState()
    const [totalPaginas, settotalPaginas] = useState(1)

    useEffect(() => {
        if (disabled) {
            return
        }
        toggleIsLoading({ value: true })
        getOrdenes({
            variables: {
                pagination_options: {
                    page,
                    take: 12,
                },
                tipo_orden: origenFilter,
                hotel_id,
                numero_orden: numeroOrdenFilter,
                fecha_registro: getDateFilters(dateFilter),
            },
        }).then((res) => {
            settotalPaginas(res.data?.historial_estados_orden.paginacion.total_paginas || 1)
            toggleIsLoading({ value: false })
        })
    }, [page, dateFilter, origenFilter, numeroOrdenFilter, disabled])

    const ordenesRes = ordenes.data?.historial_estados_orden.historial_estados_orden || []

    return { ordenes: ordenesRes, ordenesPages: totalPaginas, isLoading }
}

export default useGetOrdenes
