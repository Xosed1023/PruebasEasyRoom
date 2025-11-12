type FormatMonth = "00" | "MMM"

export const formatDateComplitSlash = (date: Date | string, shortYear = true, formatMonth: FormatMonth = "MMM"): string => {
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

function formatNumberMonth(num: number): string {
    if (num < 10) {
        return `0${num}`;
    } else {
        return num.toString();
    }
}