import { dateHelpers } from "@/helpers/dateHelpers"

export const Meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]


export const getFechaCorte = (value: string): string => {
    const { UTCStringToLocalDate } = dateHelpers()
    const date = UTCStringToLocalDate(value)

    return `${Meses[date.getMonth()]}, ${date.getDate()} ${date.getFullYear()} ${format12HourTime(date)}`
}

function format12HourTime(date: Date): string {
    const hours24 = date.getHours()
    const minutes = date.getMinutes()
    const period = hours24 >= 12 ? "pm" : "am"
    const hours12 = hours24 % 12 || 12

    const minutesFormatted = minutes.toString().padStart(2, "0")

    return `${hours12}:${minutesFormatted}${period}`
}
