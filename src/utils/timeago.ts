import { useDate } from "src/shared/hooks/useDate"
import * as timeago from "timeago.js"

const localeFunc = (number: number, index: number, totalSec): [string, string] => {
    const list: [string, string][] = [
        ["Justo ahora", "En un momento"],
        ["Hace %s segundos", "En %s segundos"],
        ["Hace 1 minuto", "En 1 minuto"],
        ["Hace %s minutos", "En %s minutos"],
        ["Hace 1 hora", "En 1 hora"],
        ["Hace %s horas", "En %s horas"],
        ["Hace 1 día", "En 1 día"],
        ["Hace %s días", "En %s dìas"],
        ["Hace 1 semana", "En 1 semana"],
        ["Hace %s semanas", "En %s semanas"],
        ["Hace 1 mes", "En 1 mes"],
        ["Hace %s meses", "En %s meses"],
        ["Hace 1 año", "En 1 año"],
        ["Hace %s años", "En %s años"],
    ]

    return list[index]
}

const localeNumberWordFunc = (number: number, index: number, totalSec): [string, string] => {
    const list: [string, string][] = [
        ["0 segundos", "0 segundos"],
        ["%s segundos", "%s segundos"],
        ["1 minuto", "1 minuto"],
        ["%s minutos", "%s minutos"],
        ["1 hora", "1 hora"],
        ["%s horas", "%s horas"],
        ["1 día", "1 día"],
        ["%s días", "%s dìas"],
        ["1 semana", "1 semana"],
        ["%s semanas", "%s semanas"],
        ["1 mes", "1 mes"],
        ["%s meses", "%s meses"],
        ["1 año", "1 año"],
        ["%s años", "%s años"],
    ]

    return list[index]
}

timeago.register("my-locale", localeFunc)
timeago.register("locale-number-word", localeNumberWordFunc)

const localDate = (UTCString: string) => {
    const { UTCStringToLocalDate } = useDate()
    return UTCStringToLocalDate(UTCString)
}

const formatTimeAgo = (date) => timeago.format(localDate(date), "my-locale")
const formatTimeAgoNumberWord = (date) => timeago.format(localDate(date), "locale-number-word")

export { formatTimeAgo, formatTimeAgoNumberWord }
