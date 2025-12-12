import { useState } from "react"
import { useParams } from "react-router-dom"
import { useGetTurnosLazyQuery, useGetTurnosQuery } from "src/gql/schema"
import { useDate } from "src/shared/hooks/useDate"
import { useProfile } from "src/shared/hooks/useProfile"

const format = (num: number) => ("0" + num).slice(-2)

const getDateParam = (date: any) => {
    const parseDate = new Date(date || "")
    const validDate = !isNaN(parseDate.getTime())
    return validDate ? parseDate : new Date()
}

export const getDaySearch = (date: string) => {
    const d = new Date(date)
    return `${d.getFullYear()}-${format(d.getMonth() + 1)}-${format(d.getDate())}`
}

export function useDateParams() {
    const params = useParams()
    const { hotel_id } = useProfile()

    const { data: turnos } = useGetTurnosQuery({
        variables: {
            hotel_id,
        },
    })

    const date_param = params?.date?.split("&")
    const fecha_inicial = getDateParam(date_param?.[0])
    const fecha_final = getDateParam(date_param?.[1] || date_param?.[0])

    return {
        fecha_inicial,
        fecha_final,
        fecha_corte_inicial: getDaySearch(fecha_inicial.toISOString()),
        fecha_corte_final: getDaySearch(fecha_final.toISOString()),
        ready: Number(turnos?.turnos?.length || 0) > 0,
        range: !!date_param?.[1],
    }
}

export function useDateParamsSemanal() {
    const { localDateToUTCString } = useDate()
    const { hotel_id } = useProfile()
    const [getTurnos] = useGetTurnosLazyQuery()

    const [dates, setdates] = useState<{
        fecha_inicial: string
        fecha_final: string
    } | null>(null)

    const getDates = (date: Date) => {
        getTurnos({
            variables: {
                hotel_id,
            },
        }).then((t) => {
            const startDateHour =
                setToEarliestTime(new Date(date.getTime()), t?.data?.turnos?.map((t) => t.hora_entrada || "") || []) ||
                new Date()
            const startDate = getStartOfWeek(startDateHour)

            const fecha_final = localDateToUTCString(date)
            setdates({
                fecha_inicial: localDateToUTCString(startDate),
                fecha_final: fecha_final,
            })
        })
    }

    function getStartOfWeek(date: Date): Date {
        const result = new Date(date)
        const day = result.getDay() // 0 (domingo) a 6 (sábado)
        const diff = day === 0 ? -6 : 1 - day // ajusta para que lunes sea el día 0

        result.setDate(result.getDate() + diff)
        return result
    }

    function setToEarliestTime(baseDate: Date, times: string[]): Date | null {
        if (times.length === 0) return null

        const toUTCDate = (timeStr: string): Date => {
            const [hms, offsetStr] = timeStr.split("-")
            const [hours, minutes, seconds] = hms.split(":").map(Number)
            const offset = Number(offsetStr)
            return new Date(Date.UTC(2000, 0, 1, hours - offset, minutes, seconds))
        }

        const earliest = times.reduce((a, b) => (toUTCDate(a) < toUTCDate(b) ? a : b))
        const [hms, offsetStr] = earliest.split("-")
        const [hours, minutes, seconds] = hms.split(":").map(Number)
        const offset = Number(offsetStr)

        // Seteamos la hora ajustando el offset
        const newDate = new Date(baseDate) // copiar fecha original
        newDate.setUTCHours(hours + offset, minutes - 30, seconds, 0)

        return newDate
    }

    return { dates, getDates }
}
