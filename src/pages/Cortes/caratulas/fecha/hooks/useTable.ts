import { useEffect, useMemo, useState } from "react"
import { getCurrencyFormat } from "src/utils/string"
import { formatDateComplitSlash } from "src/shared/hooks/formatDate-DD-MM-YY"
import { useDate } from "src/shared/hooks/useDate"

const ITEM_ALL = { value: "todos", valueToDisplay: "Todos" }

export function useHeader(data: any[]) {
    const getFilterOptions = (key: string) => {
        const options: any[] = []

        data?.forEach((item) => {
            const value = item?.[key]
            if (value) {
                const find = options.find((item) => item?.value === value)
                if (!find) options.push({ value, valueToDisplay: value })
            }
        })

        return options.length > 0 ? [ITEM_ALL, ...options] : []
    }

    const headers = useMemo(() => {
        const base = [
            { value: "Folio" },
            { value: "Fecha" },
            {
                value: "Turno",
                filterMenu: getFilterOptions("turno"),
            },
            {
                value: "Responsable",
                filterMenu: getFilterOptions("responsable"),
            },
            {
                value: "Recepcionista",
                filterMenu: getFilterOptions("recepcionista"),
            },
            {
                value: "Total",
            },
            {
                value: "Incidencias",
            },
            {
                value: "Estatus",
                filterMenu: getFilterOptions("estatus"),
            },
            {
                value: "Acciones",
            },
        ]

        return base
    }, [data])

    return headers
}

export function useRows(data: any[]) {
    const { UTCStringToLocalDate } = useDate()
    const [rows, setRows] = useState<any[]>([])

    const getRowFormat = (list: any[]) => {
        const orderList = list.reverse() || []
        return orderList.map((item) => {
            const base = [
                { value: item?.folio },
                { value: formatDateComplitSlash(UTCStringToLocalDate(item?.fecha)) },
                {
                    value: `Turno ${item?.turno === "Matutino" ? 1 : item?.turno === "Vespertino" ? 2 : 3} - ${
                        item?.turno
                    }`,
                },
                { value: item?.responsable },
                { value: item?.recepcionista },
                { value: getCurrencyFormat(item?.total) },
                { value: item?.incidencias },
                { value: item?.estatus },
                { value: item?.corte_id },
            ]
            return {
                value: base,
            }
        })
    }

    useEffect(() => {
        if (data?.length > 0) {
            setRows(getRowFormat(data))
        } else {
            setRows([])
        }
    }, [data?.length])

    const handleFilter = (params: any[]) => {
        const getKeys = (id) => clearParams.filter(({ idx }) => idx === id).map(({ filter }) => filter)
        const findValue = (keys: string[], value: string) => (keys.length > 0 ? keys.includes(value) : true)

        const keyAll = params.filter(({ filter }) => filter === "todos")
        const clearParams =
            keyAll.length === 0 ? params : params.filter(({ idx }) => keyAll.find((item) => item.idx !== idx))
        if (clearParams.length > 0) {
            const results: any[] = []
            const turnoKeys = getKeys(2)
            const responsableKeys = getKeys(3)
            const recepcionistaKeys = getKeys(4)
            const estatusKeys = getKeys(7)

            data.forEach((item) => {
                if (
                    findValue(turnoKeys, item?.turno) &&
                    findValue(responsableKeys, item?.responsable) &&
                    findValue(recepcionistaKeys, item?.recepcionista) &&
                    findValue(estatusKeys, item?.estatus)
                ) {
                    results.push(item)
                }
            })

            setRows(getRowFormat(results))
        } else {
            setRows(getRowFormat(data))
        }
    }

    return { rows, handleFilter }
}
