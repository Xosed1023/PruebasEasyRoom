import { DateTime } from "luxon"
import { div, times } from "../helpers/calculator"
import { parseTimeString } from "../helpers/parseTimeString"
import { useProfile } from "./useProfile"

// Funciones de utilidad que pueden usarse fuera de componentes React
export const createDateUtils = (zona_horaria = "America/Mexico_City") => {
    const zonehotel = zona_horaria
    const localDateToOperableDate = (localDate: Date) => {
        return new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000)
    }

    // Para recibir
    const UTCStringToLocalDate = (UTCString?: string): Date => {
        if (!UTCString) {
            return new Date()
        }
        return UTCString.includes("Z")
            ? DateTime.fromISO(UTCString, { zone: zonehotel }).toJSDate()
            : localDateToOperableDate(DateTime.fromISO(UTCString, { zone: zonehotel }).toJSDate())
    }

    // Para enviar
    const localDateToUTCString = (localDate: Date): string => {
        return localDate.toISOString()
    }

    const getLastDayOfPreviousMonth = (date: Date) => {
        const firstDayOfCurrentMonth = new Date(date.getFullYear(), date.getMonth(), 1) // Primer día del mes actual
        const lastDayOfPreviousMonth = new Date(firstDayOfCurrentMonth) // Copiamos la fecha
        lastDayOfPreviousMonth.setDate(firstDayOfCurrentMonth.getDate() - 1) // Restamos un día

        return lastDayOfPreviousMonth
    }

    const getHoursPassedSince = (date?: Date): string => {
        if (!(date instanceof Date)) {
            return "-"
        }
        const now = new Date()
        const timeDifference = now.getTime() - date.getTime()
        const hours = Math.floor(timeDifference / (1000 * 60 * 60))

        return hours + ""
    }

    const getDayHoursRange = (date: Date) => {
        return {
            fecha_inicial: localDateToUTCString(new Date(date.getFullYear(), date.getMonth(), date.getDate())),
            fecha_final: localDateToUTCString(
                new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 59)
            ),
        }
    }

    const formatHoursAMPMFromDate = (date: Date) => {
        const hours = date.getHours()
        const minutes = date.getMinutes()
        const ampm = hours >= 12 ? "PM" : "AM"

        const hora12 = hours % 12 || 12

        const formattedTime = `${hora12}:${minutes.toString().padStart(2, "0")} ${ampm}`

        return formattedTime
    }

    const formatLongDate = (fecha?: Date, withHoursAMPM = true, withHours24 = false): string => {
        if (!(fecha instanceof Date)) {
            return "-"
        }
        const operableFecha = localDateToOperableDate(fecha)

        const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]

        const dia = operableFecha.getDate()
        const mes = meses[operableFecha.getMonth()]

        const año = operableFecha.getFullYear()

        if (withHoursAMPM) {
            const operableFechaFormateada = `${mes}, ${dia} ${año} - ${formatHoursAMPMFromDate(operableFecha)}`
            return operableFechaFormateada
        }
        const hours = operableFecha.getHours()
        const minutes = operableFecha.getMinutes()
        if (withHours24) {
            const operableFechaFormateada = `${mes}, ${dia} ${año} - ${hours} ${minutes} hrs`
            return operableFechaFormateada
        }
        const operableFechaFormateada = `${mes}, ${dia} ${año}`
        return operableFechaFormateada
    }
    const formatDateWithTime = (fecha?: Date, zona_horaria?: string): string => {
        if (!(fecha instanceof Date)) {
            return "-"
        }
        return fecha.toLocaleString("es-MX", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
            timeZone: zona_horaria || zonehotel || "America/Mexico_City",
        })
    }

    const formatDateZone = (fecha?: Date, zona_horaria?: string): string => {
        if (!(fecha instanceof Date)) return "-"

        const options = { timeZone: zona_horaria || zonehotel || "America/Mexico_City" }
        const fechaZonificada = new Date(fecha.toLocaleString("en-US", options))

        const mes = fechaZonificada.toLocaleString("en-US", {
            month: "short",
            timeZone: zona_horaria || zonehotel || "America/Mexico_City",
        })
        const dia = fechaZonificada.getDate()
        const año = fechaZonificada.getFullYear()
        const hora = fechaZonificada.getHours().toString().padStart(2, "0")
        const minutos = fechaZonificada.getMinutes().toString().padStart(2, "0")
        const ampm = fechaZonificada.getHours() >= 12 ? "PM" : "AM"

        return `${mes}, ${dia} ${año} ${hora}:${minutos} ${ampm}`
    }

    const formatLongDateFromUTCString = ({
        UTCString,
        withHoursAMPM = true,
    }: {
        UTCString: string
        withHoursAMPM: boolean
    }) => {
        return formatLongDate(UTCStringToLocalDate(UTCString), withHoursAMPM)
    }

    const addHours = (date: Date, hours: number) => {
        const newDate = new Date(date.getTime()) // Clonar la fecha original
        newDate.setHours(newDate.getHours() + hours) // Sumar las horas
        return newDate
    }

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
        formatLongDate,
        getLastDayOfPreviousMonth,
        formatLongDateFromUTCString,
        formatHoursAMPMFromDate,
        addHours,
        localDateToOperableDate,
        diffDays,
        addHHMMSS,
        areSameDay,
        setHHMMSS,
        formatDateWithTime,
        formatDateZone,
        getDayHoursRange,
    }
}

// Hook para usar dentro de componentes React con zona horaria del perfil
export const useDate = (zona_horaria?: string) => {
    const { zona_horaria: zonaHorariaProfile } = useProfile()
    const zonehotel = zona_horaria || zonaHorariaProfile || "America/Mexico_City"
    console.log("Using timezone:", zonehotel)
    return createDateUtils(zonehotel)
}
