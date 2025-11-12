import { useState, useEffect } from "react"
import { getDateString } from "src/utils/date"
import { useDate } from "src/shared/hooks/useDate"
import { getCurrencyFormat } from "src/utils/string"
import { GetSurtidosByAlmacenArtIdQuery } from "src/gql/schema"
import { capitalize } from "src/shared/helpers/capitalize"

export function useTable(data: GetSurtidosByAlmacenArtIdQuery | undefined) {
    const [rows, setRows] = useState<any[]>([])
    const { UTCStringToLocalDate } = useDate()

    const getRowFormat = (list: any[]) => {
        const orderList =
            list.sort((a, b) => new Date(b.fecha_ingreso).getTime() - new Date(a.fecha_ingreso).getTime()) || []

        const rows = orderList.map(
            ({ costo_unitario = 0, costo_total = 0, cantidad = 0, fecha_ingreso = "", colaborador, tipo = "", folio = "", numero_orden_factura = "" }, index) => {
                const base = [
                    { value: folio },
                    {
                        value: fecha_ingreso
                            ? getDateString(UTCStringToLocalDate(fecha_ingreso?.split(".")[0]))
                            : "N/A",
                    },
                    {
                        value: tipo ? capitalize(tipo) : "N/A",
                    },
                    {
                        value: cantidad,
                    },
                    {
                        value: getCurrencyFormat(costo_unitario || 0),
                    },
                    {
                        value: getCurrencyFormat(costo_total || 0),
                    },
                    {
                        value: numero_orden_factura || "N/A",
                    },
                    {
                        value: colaborador
                            ? `${colaborador?.nombre} ${colaborador?.apellido_paterno} ${colaborador?.apellido_materno}`
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

    useEffect(()=>{
        if(data?.surtidos) setRows(getRowFormat(data?.surtidos || []))

    }, [data])

    const handleFilter = (params: any[]) => {
        const list = data?.surtidos || []

        const getKeys = (id) => clearParams.filter(({ idx }) => idx === id).map(({ filter }) => filter)
        const findValue = (keys: string[], value: string) => (keys.length > 0 ? keys.includes(value) : true)

        const keyAll = params.filter(({ filter }) => filter === "todos")
        const clearParams =
            keyAll.length === 0 ? params : params.filter(({ idx }) => keyAll.find((item) => item.idx !== idx))
        if (clearParams.length > 0) {
            const results: any[] = []
            const folioKeys = getKeys(0)
            const tipoKeys = getKeys(2)

            list.forEach((item) => {
                if (
                    findValue(folioKeys, `${item?.folio}`) &&
                    findValue(tipoKeys, item?.tipo)
                ) {
                    results.push(item)
                }
            })

            setRows(getRowFormat([...results]))
        } else {
            setRows(getRowFormat([...list]))
        }
    }

    return {
        rows,
        visibleData: data && data?.surtidos?.length > 0,
        handleFilter
    }
}
