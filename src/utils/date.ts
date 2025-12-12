import { useDate } from "src/shared/hooks/useDate"

export const months: string[] = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
]

const format = (num: number) => ("0" + num).slice(-2)

export const getDateStringMDY = (date: Date | string): string => {
    const current = new Date(date)
    return `${months?.[current?.getMonth()]?.slice(0, 3)} ${format(current?.getDate())}, ${current?.getFullYear()}`
}

export const getDateString = (date: Date | string): string => {
    const current = new Date(date)
    return `${format(current.getDate())}/${format(current.getMonth() + 1)}/${current.getFullYear()}`
}

export const getHourString = (date: Date | string): string => {
    const current = new Date(date)
    return `${format(current.getHours())}:${format(current.getMinutes())}`
}

export const getExactDate = (UTCString: any): Date => {
    const date = new Date(UTCString)
    date.setHours(date.getHours())

    return date
}

export const getNewDate = (date: string) => {
    const d = date?.split("/")
    const newDate = new Date(d[2] + "/" + d[1] + "/" + d[0])
    return newDate
}

//Fecha con formato dd/MMM/yy h:m tt
export const getFormatLongDateHour = (dateString: any): string => {
    const date = new Date(dateString)
    const formattedDate = date
        .toLocaleString("es-MX", {
            day: "2-digit",
            month: "short",
            year: "2-digit",
        })
        .replace(/ /g, "/")
    const formattedHour = date.toLocaleString("en-US", {
        hour12: true,
        hour: "2-digit",
        minute: "2-digit",
    })

    return formattedDate + " " + formattedHour
}

export const getDateStringMDYH = (date: Date | string) => {
    const { UTCStringToLocalDate } = useDate()
    const current = typeof date === "string" ? UTCStringToLocalDate(date) : date
    const hour = `${format(current.getHours())}:${format(current.getMinutes())}`

    return `${months[current.getMonth()].slice(0, 3)}, ${current.getDate()} ${current.getFullYear()} ${hour} ${
        current.getHours() >= 12 ? "PM" : "AM"
    }`
}

export const getDateStringDMYH = (date: Date | string, config?: { hourFormat: boolean }) => {
    const current = new Date(date)
    const hour = `${format(current.getHours())}:${format(current.getMinutes())}`

    return `${format(current.getDate())}/${months[current.getMonth()].slice(0, 3)}/${current.getFullYear()} ${hour}${
        config?.hourFormat ? ` ${current.getHours() >= 12 ? "PM" : "AM"}` : ""
    }`
}

// Fecha con formato MMM, dd yyyy (ej. Jul, 15 2025)
export const getShortDateFormatted = (date: Date | string): string => {
    const current = new Date(date)
    const shortMonth = months[current.getMonth()]?.slice(0, 3)
    const day = ("0" + current.getDate()).slice(-2)
    const year = current.getFullYear()
    return `${shortMonth}, ${day} ${year}`
}
