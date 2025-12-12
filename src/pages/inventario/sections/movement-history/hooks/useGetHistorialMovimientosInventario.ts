import { useEffect, useState } from "react"
import {
    HistorialMovimientosInventario,
    MovimientoHistorialInventario,
    Order,
    TipoArticulo,
    TipoMovimientoHistorialInventario,
    useHistorial_Movimientos_InventarioLazyQuery,
} from "src/gql/schema"
import { useProfile } from "src/shared/hooks/useProfile"

interface Props {
    month: number
    year: number
    page: number
    search: string
    filters: {
        tipoArticulo: string
        movimiento: string
        tipoMovimiento: string
    }
}

const useGetHistorialMovimientosInventario = ({
    month,
    year,
    page,
    search,
    filters,
}: Props) => {
    const [getHistorial] = useHistorial_Movimientos_InventarioLazyQuery()
    const { hotel_id } = useProfile()
    const [loading, setloading] = useState(false)
    const [historial, sethistorial] = useState<{
        historialMovimientos: HistorialMovimientosInventario[]
        currentPage: number
        totalPages: number
    }>()

    useEffect(() => {
        if (!search) {
            return
        }
        setloading(true)
        getHistorial({
            variables: {
                hotel_id,
                nombre_articulo: search,
                ...(filters.tipoArticulo ? { tipo_articulo: filters.tipoArticulo as TipoArticulo } : {}),
                ...(filters.tipoMovimiento
                    ? { tipo: filters.tipoMovimiento as TipoMovimientoHistorialInventario }
                    : {}),
                ...(filters.movimiento ? { movimiento: filters.movimiento as MovimientoHistorialInventario } : {}),
                fecha_registro: {
                    mes_y_anio: month < 9 ? "0" + (month + 1) + "-" + year : month + 1 + "-" + year,
                },
                pagination_options: {
                    page: 1,
                    take: 12,
                    order: Order.Desc
                },
            },
        })
            .then(({ data }) => {
                const historial = (data?.historial_movimientos_inventario.historial_movimientos_inventario ||
                    []) as HistorialMovimientosInventario[]

                sethistorial({
                    historialMovimientos: historial,
                    currentPage: data?.historial_movimientos_inventario.paginacion.pagina_actual || 1,
                    totalPages: data?.historial_movimientos_inventario.paginacion.total_paginas || 1,
                })
            })
            .finally(() => setloading(false))
    }, [search, filters])

    useEffect(() => {
        if (search) {
            return
        }
        setloading(true)
        getHistorial({
            variables: {
                hotel_id,
                ...(filters.tipoArticulo ? { tipo_articulo: filters.tipoArticulo as TipoArticulo } : {}),
                ...(filters.tipoMovimiento
                    ? { tipo: filters.tipoMovimiento as TipoMovimientoHistorialInventario }
                    : {}),
                ...(filters.movimiento ? { movimiento: filters.movimiento as MovimientoHistorialInventario } : {}),
                fecha_registro: {
                    mes_y_anio: month < 9 ? "0" + (month + 1) + "-" + year : month + 1 + "-" + year,
                },
                pagination_options: {
                    page,
                    take: 12,
                    order: Order.Desc
                },
            },
        })
            .then(({ data }) => {
                const historial = (data?.historial_movimientos_inventario.historial_movimientos_inventario ||
                    []) as HistorialMovimientosInventario[]

                sethistorial({
                    historialMovimientos: historial,
                    currentPage: data?.historial_movimientos_inventario.paginacion.pagina_actual || 1,
                    totalPages: data?.historial_movimientos_inventario.paginacion.total_paginas || 1,
                })
            })
            .finally(() => setloading(false))
    }, [year, month, page, search, filters])

    return {
        currentPage: historial?.currentPage,
        totalPages: historial?.totalPages,
        items: historial?.historialMovimientos,
        loading,
    }
}

export default useGetHistorialMovimientosInventario
