import { DateTime } from "luxon"
import { div, times } from "../helpers/calculator"
import { parseTimeString } from "../helpers/parseTimeString"

export const useDate = (zona_horaria?: string) => {
    const zonehotel = zona_horaria || "America/Mexico_City"

    // Ajusta una fecha local removiendo el timezone offset (fecha "neutral" sin desfase).
    const localDateToOperableDate = (localDate: Date) => {
        return new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000)
    }

    // Convierte un string UTC a una fecha local usando la zona horaria del hotel.
    const UTCStringToLocalDate = (UTCString?: string): Date => {
        if (!UTCString) {
            return new Date()
        }
        return UTCString.includes("Z")
            ? DateTime.fromISO(UTCString, { zone: zonehotel }).toJSDate()
            : localDateToOperableDate(DateTime.fromISO(UTCString, { zone: zonehotel }).toJSDate())
    }

    // Convierte una fecha local a un string ISO en formato UTC para enviarlo al backend.
    const localDateToUTCString = (localDate: Date): string => {
        return localDate.toISOString()
    }

    // Retorna el último día del mes anterior basado en la fecha proporcionada.
    const getLastDayOfPreviousMonth = (date: Date) => {
        const firstDayOfCurrentMonth = new Date(date.getFullYear(), date.getMonth(), 1) // Primer día del mes actual
        const lastDayOfPreviousMonth = new Date(firstDayOfCurrentMonth) // Copiamos la fecha
        lastDayOfPreviousMonth.setDate(firstDayOfCurrentMonth.getDate() - 1) // Restamos un día

        return lastDayOfPreviousMonth
    }

    // Calcula las horas transcurridas desde la fecha dada hasta ahora. Retorna "-" si es inválida.
    const getHoursPassedSince = (date?: Date): string => {
        if (!(date instanceof Date)) {
            return "-"
        }
        const now = new Date()
        const timeDifference = now.getTime() - date.getTime()
        const hours = Math.floor(timeDifference / (1000 * 60 * 60))

        return hours + ""
    }

    // Crea el rango completo de un día (inicio y fin) convertido a UTC para consultas.
    const getDayHoursRange = (date: Date) => {
        return {
            fecha_inicial: localDateToUTCString(new Date(date.getFullYear(), date.getMonth(), date.getDate())),
            fecha_final: localDateToUTCString(
                new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 59)
            ),
        }
    }

    // Convierte un ISO string a Date usando Luxon. Retorna null si no es válido.
    const parseISOToDate = (isoString: string | null | undefined): Date | null => {
        if (!isoString) return null
        return DateTime.fromISO(isoString).toJSDate()
    }

    // Suma horas a una fecha sin alterar zonas horarias; retorna una nueva Date. 
    const addHours = (date: Date, hours: number) => {
        const newDate = new Date(date.getTime()) // Clonar la fecha original
        newDate.setHours(newDate.getHours() + hours) // Sumar las horas
        return newDate
    }

    // Suma horas, minutos y segundos a una fecha y devuelve una nueva instancia Date.
    const addHHMMSS = ({
        startDate,
        hours,
        minutes,
        seconds,
    }: {
        startDate: Date
        hours: number
        minutes: number
        seconds: number
    }): Date => {
        const newDate = new Date(startDate)
        newDate.setHours(startDate.getHours() + hours)
        newDate.setMinutes(startDate.getMinutes() + minutes)
        newDate.setSeconds(startDate.getSeconds() + seconds)
        return newDate
    }

    // newHour debe ser recibida en formato "HH:MM:SS" con isNewHourInUTC = false ó "HH:MM:SS+HH" con isNewHourInUTC = true
    const setHHMMSS = ({
        startDate,
        newHour,
        isNewHourInUTC = true,
    }: {
        startDate: Date
        newHour: string
        isNewHourInUTC?: boolean
    }): Date => {
        if (isNewHourInUTC) {
            const newHourDate = parseTimeString(newHour)

            const newDate = new Date(startDate)

            // Set the hours, minutes, and seconds of the new Date object
            newDate.setHours(newHourDate.getHours())
            newDate.setMinutes(newHourDate.getMinutes())
            newDate.setSeconds(newHourDate.getSeconds())
            newDate.setMilliseconds(newHourDate.getMilliseconds())

            return newDate
        }
        // Parse the newHour string into hours, minutes, and seconds
        const [hours, minutes, seconds] = newHour.split(":").map(Number)

        // Create a new Date object with the same date as the originalDate
        const newDate = new Date(startDate)

        // Set the hours, minutes, and seconds of the new Date object
        newDate.setHours(hours)
        newDate.setMinutes(minutes)
        newDate.setSeconds(seconds)
        newDate.setMilliseconds(parseInt(newHour.slice(6, Infinity)))

        return newDate
    }

    /**
     * @param fechaInicio
     * @param fechaFin
     * @returns
     */
    const diffDays = (fechaInicio: Date, fechaFin: Date): number => {
        // Calcula la diferencia en milisegundos entre las dos fechas
        const diferenciaEnMilisegundos = fechaFin.getTime() - fechaInicio.getTime()

        // Convierte la diferencia en milisegundos a días
        const diferenciaEnDias = div(diferenciaEnMilisegundos, times(times(times(1000, 60), 60), 24))
        // Asegúrate de redondear el resultado al número entero más cercano
        return Math.round(diferenciaEnDias)
    }

    const areSameDay = (date1?: Date, date2?: Date) => {
        // Obtén el año, mes y día de la primera fecha
        const anio1 = date1?.getFullYear()
        const mes1 = date1?.getMonth()
        const dia1 = date1?.getDate()

        // Obtén el año, mes y día de la segunda fecha
        const anio2 = date2?.getFullYear()
        const mes2 = date2?.getMonth()
        const dia2 = date2?.getDate()

        // Compara si son del mismo día
        return anio1 === anio2 && mes1 === mes2 && dia1 === dia2
    }

    // Verifica si entre dos fechas han pasado al menos 'minutes' minutos.
    const timeLimitReached = ({
        fecha1,
        fecha2,
        minutes,
    }: {
        fecha1: Date
        fecha2: Date
        minutes: number
    }): boolean => {
        const diferenciaMs = fecha2.getTime() - fecha1.getTime()
        const minutos = diferenciaMs / (1000 * 60)
        return minutos >= minutes
    }

    return {
        timeLimitReached,
        UTCStringToLocalDate,
        localDateToUTCString,
        getHoursPassedSince,
        getLastDayOfPreviousMonth,
        addHours,
        localDateToOperableDate,
        diffDays,
        addHHMMSS,
        areSameDay,
        setHHMMSS,
        getDayHoursRange,
        parseISOToDate,
    }
}
