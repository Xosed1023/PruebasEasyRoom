import { useState, useEffect } from "react"
import { getDateString } from "src/utils/date"
import { useDate } from "src/shared/hooks/useDate"
import { getCurrencyFormat } from "src/utils/string"
import useSortTable from "src/shared/hooks/useSortTable"

export function useTableHistorialProduccion(data) {
    const [rows, setRows] = useState<any[]>([])
    const { UTCStringToLocalDate } = useDate()

    const getRowFormat = (list: any[]) => {
        const orderList =
            list.sort((a, b) => new Date(b.fecha_produccion).getTime() - new Date(a.fecha_produccion).getTime()) || []
        const rows = orderList.map(
            (
                {
                    costo_produccion = 0,
                    costo_unidad_minima_produccion = 0,
                    unidad = "",
                    fecha_produccion = "",
                    responsable,
                    cantidad_producida = "",
                    folio = "",
                },
                index
            ) => {
                const base = [
                    { value: folio, fromHeaderSort: "Folio", sortValue: Number(folio) },
                    {
                        value: fecha_produccion
                            ? getDateString(UTCStringToLocalDate(fecha_produccion?.split(".")[0]))
                            : "N/A",
                    },
                    {
                        value: cantidad_producida ? cantidad_producida + unidad : "0",
                    },
                    {
                        value: getCurrencyFormat(costo_produccion || 0),
                    },
                    {
                        value: costo_unidad_minima_produccion
                            ? getCurrencyFormat(costo_unidad_minima_produccion || 0) + unidad
                            : "0",
                    },
                    {
                        value: responsable
                            ? `${responsable?.nombre} ${responsable?.apellido_paterno} ${responsable?.apellido_materno}`
                            : "-",
                    },
                ]
                return {
                    value: base,
                }
            }
        )

        return rows
    }

    useEffect(() => {
        if (data?.historial_producciones_inventarios)
            setRows(getRowFormat(data?.historial_producciones_inventarios || []))
    }, [data])

    const handleSort = (params) => {
        const sortData = useSortTable({ sortState: params?.sort || null, sortedData: rows, i: params?.idx || 0 })
        setRows(sortData)
    }

    return {
        rows,
        visibleData: data && data?.historial_producciones_inventarios?.length > 0,
        handleSort,
    }
}
