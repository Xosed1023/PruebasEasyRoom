import { useEffect, useMemo, useState } from "react"
//import { getDateStringMDYH } from "src/utils/date"
import { formatCurrency } from "src/shared/hooks/formatCurrency"
import { useDate } from "src/shared/hooks/useDate"
import { getDateStringMDYH } from "src/utils/date"

const ITEM_ALL = { value: "todos", valueToDisplay: "Todos" }

export function useHeader(data: any[]) {
    const getFilterOptions = (key: string) => {
        const options: any[] = []
        data?.forEach((item) => {
            let value = ""
            if (key === "turno") value = item?.turno?.nombre
            if (key === "responsable") {
                if (item?.usuario_cierra !== null)
                    value = `${item?.usuario_cierra?.nombre} ${item?.usuario_cierra?.apellido_paterno} ${item?.usuario_cierra?.apellido_materno}`
            }
            if (key === "recepcionista")
                value = `${item?.usuario_crea?.nombre} ${item?.usuario_crea?.apellido_paterno} ${item?.usuario_crea?.apellido_materno}`
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
            {
                value: "Fecha",
            },
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
        const orderList =
            list.sort((a, b) => new Date(b.fecha_inicio_corte).getTime() - new Date(a.fecha_inicio_corte).getTime()) ||
            []
        return orderList.map((row) => {
            const base = [
                { value: row.usuario_cierra_corte ? row.folio : "Pendiente" },
                {
                    value: row.fecha_inicio_corte
                        ? getDateStringMDYH(UTCStringToLocalDate(row.fecha_inicio_corte?.replace(" ", "T")))
                        : "N/A",
                    fromHeaderSort: "Fecha",
                },
                {
                    value: row.turno.nombre,
                },
                {
                    value: row.usuario_cierra_corte
                        ? `${row?.usuario_cierra?.nombre} ${row?.usuario_cierra?.apellido_paterno} ${row?.usuario_cierra?.apellido_materno}`
                        : "-",
                },
                {
                    value: `${row?.usuario_crea?.nombre} ${row?.usuario_crea?.apellido_paterno} ${row?.usuario_crea?.apellido_materno}`,
                },
                {
                    value: formatCurrency(Number(row.total_corte)),
                },
                { value: row.incidencias.length },
                { value: row.usuario_cierra_corte ? "Cerrado" : "Cerrar corte" },
            ]
            return {
                value: base,
                goToData: row?.corte_id,
            }
        })
    }

    useEffect(() => {
        if (rows.length === 0 && data?.length > 0) {
            return setRows(getRowFormat(data))
        }
    }, [data])

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

            data.forEach((item) => {
                if (
                    findValue(turnoKeys, item?.turno?.nombre) &&
                    findValue(
                        responsableKeys,
                        `${item?.usuario_cierra?.nombre} ${item?.usuario_cierra?.apellido_paterno} ${item?.usuario_cierra?.apellido_materno}`
                    ) &&
                    findValue(
                        recepcionistaKeys,
                        `${item?.usuario_crea?.nombre} ${item?.usuario_crea?.apellido_paterno} ${item?.usuario_crea?.apellido_materno}`
                    )
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
