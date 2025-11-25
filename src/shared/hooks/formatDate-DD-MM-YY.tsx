import { DateTime } from "luxon"

type FormatMonth = "00" | "MMM" | "MM"

export const formatDateComplitSlash = (
    date: Date | string,
    shortYear = true,
    formatMonth: FormatMonth = "MMM"
): string => {
    if (typeof date === "string") {
        // Intenta convertir la cadena en una fecha
        date = new Date(date)
    }

    if (!(date instanceof Date) || isNaN(date.getTime?.())) {
        // La conversión no fue exitosa, devolver una cadena vacía o manejar el error según corresponda
        return ""
    }

    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
    const day = date.getDate()
    const month = formatMonth === "MMM" ? months[date.getMonth()] : formatNumberMonth(date.getMonth() + 1)
    const year = shortYear ? `${date.getFullYear()}`.slice(2, 4) : date.getFullYear()

    return `${day}/${month}/${year}`
}

export const formatDateHotelSlash = (
    UTCString: string,
    shortYear = true,
    formatMonth: "MMM" | "MM" = "MMM",
    zona_horaria = "America/Mexico_City"
): string => {
    const dt = DateTime.fromISO(UTCString, { zone: zona_horaria })
    if (!dt.isValid) return ""

    const datePart = formatDateComplitSlash(dt.toJSDate(), shortYear, formatMonth)

    const hour12 = dt.hour % 12 || 12
    const minutes = dt.minute.toString().padStart(2, "0")
    const ampm = dt.hour >= 12 ? "PM" : "AM"

    return `${datePart}  ${hour12}:${minutes} ${ampm}`
}

function formatNumberMonth(num: number): string {
    if (num < 10) {
        return `0${num}`
    } else {
        return num.toString()
    }
}
