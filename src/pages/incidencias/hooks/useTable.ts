import { useMemo } from "react"
import { capitalizeString } from "src/shared/hooks/capitalizeString"

export function useHeader(data) {
    const getFilterOptions = (key: string) => {
        const options: any[] = []

        data?.forEach((item) => {
            let value = ""
            if (key === "numero_habitacion") {
                value = item?.habitacion?.numero_habitacion
            } else {
                value = item?.[key]
            }
            if (value) {
                const find = options.find((item) => item?.value === value)
                if (!find) options.push({ value, valueToDisplay: capitalizeString(value) })
            }
        })

        return options.length > 0 ? [...options] : []
    }

    const headers = useMemo(() => {
        const base = [
            { value: "Folio" },
            { value: "Estatus", filterMenu: getFilterOptions("estado"), isFilterUnique: true },
            { value: "Fecha de registro" },
            { value: "Lugar o responsable", filterMenu: getFilterOptions("area"), isFilterUnique: true },
            { value: "Tipo", filterMenu: getFilterOptions("tipo_incidencia"), isFilterUnique: true },
            { value: "Habitación", filterMenu: getFilterOptions("numero_habitacion"), isFilterUnique: true },
            { value: "Matrícula" },
            { value: "Descripción" },
            { value: "Urgencia", filterMenu: getFilterOptions("severidad"), isFilterUnique: true },
        ]
        return base
    }, [data])

    return headers
}
