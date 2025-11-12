import { useEffect, useState } from "react"
import { capitalizeString } from "src/shared/hooks/capitalizeString"
import { useDate } from "src/shared/hooks/useDate"
import { formatLongDate } from "src/shared/helpers/formatLongDate"
import { useProfile } from "src/shared/hooks/useProfile"
import { puestosRestaurante } from "src/constants/puestos"

export function useRows(data: any[]) {
    const [rows, setRows] = useState<any[]>([])
    const [saveSearch, setSearch] = useState<string>("")
    const { UTCStringToLocalDate } = useDate()
    const { rolName } = useProfile()

    const getRowFormat = (list: any[]) => {
        return list.map((incidencia) => {
            const base = [
                { value: incidencia?.folio },
                { value: capitalizeString(incidencia?.estado) },
                { value: formatLongDate(UTCStringToLocalDate(incidencia.fecha_registro)) },
                { value: incidencia.area || "-" },
                {
                    value: incidencia.habitacion
                            ? capitalizeString(incidencia.habitacion?.tipo_habitacion?.nombre || "") +
                              "/" +
                              (incidencia.habitacion?.numero_habitacion || "")
                            : "-",
                },
                
                { value: incidencia?.matricula || "-" },
                { value: capitalizeString(incidencia.detalle || "-") },
                { value: capitalizeString(incidencia?.severidad) },
            ]
            return {
                goTo: incidencia?.incidencia_id,
                value: base,
            }
        })
    }

    useEffect(() => {
        let filteredData = data
        const perfil = {
            VALETPARKING: "Valet parking",
            ROOMSERVICE: "Room service",
            RESTAURANTE: puestosRestaurante,
        }
        if (perfil[rolName]) {
            filteredData = data.filter(
                (incidencia) => incidencia.colaborador_reporta?.puesto?.nombre === perfil[rolName]
            )
        }

        if (filteredData?.length > 0) {
            setRows(getRowFormat(filteredData))
        } else {
            setRows([])
        }
    }, [data.length, rolName])

    const handleFilter = (params: any[]) => {
        const getKeys = (id) => clearParams.filter(({ idx }) => idx === id).map(({ filter }) => filter)
        const findValue = (keys: string[], value: string) => (keys.length > 0 ? keys.includes(value) : true)

        const keyAll = params.filter(({ filter }) => filter === "todas")
        const clearParams =
            keyAll.length === 0 ? params : params.filter(({ idx }) => keyAll.find((item) => item.idx !== idx))
        if (clearParams.length > 0) {
            const results: any[] = []
            const estadoKeys = getKeys(1)
            const lugarKeys = getKeys(3)
            const tipoKeys = getKeys(4)
            const habitacionKeys = getKeys(5)
            const urgenciaKeys = getKeys(8)

            data.forEach((item) => {
                if (
                    findValue(estadoKeys, item?.estado) &&
                    findValue(urgenciaKeys, item?.severidad) &&
                    findValue(lugarKeys, item?.area) &&
                    findValue(tipoKeys, item?.tipo_incidencia) &&
                    findValue(habitacionKeys, item?.habitacion?.numero_habitacion)
                ) {
                    results.push(item)
                }
            })
            setRows(getRowFormat(results))
        } else {
            setRows(getRowFormat(data))
        }
    }

    const handleSearch = (search: string) => {
        setSearch(search)
        if (search) {
            const results = data?.filter(
                (incidencia: any) =>
                    incidencia?.folio?.toString() === search ||
                    incidencia?.huesped?.toLowerCase().includes(search.toLowerCase()) ||
                    incidencia?.matricula?.toLowerCase().includes(search.toLowerCase())
            )
            setRows(getRowFormat(results))
        } else {
            setRows(getRowFormat(data))
        }
    }

    return { rows, search: saveSearch, handleFilter, handleSearch }
}
