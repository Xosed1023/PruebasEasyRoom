import { DateTime } from "luxon"
import { div, times } from "../helpers/calculator"

export const dateHelpers = (zona_horaria?: string) => {
    const zonehotel = zona_horaria || "America/Mexico_City"
    const localDateToOperableDate = (localDate: Date) => {
        return new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000)
    }

    const getDayHoursRange = (date: Date) => {
        return {
            fecha_inicial: localDateToUTCString(new Date(date.getFullYear(), date.getMonth(), date.getDate())),
            fecha_final: localDateToUTCString(
                new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 59)
            ),
        }
    }

    const getMonthRange = (date: Date) => {
        const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
        const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999)

        return {
            fecha_inicial: localDateToUTCString(firstDayOfMonth),
            fecha_final: localDateToUTCString(lastDayOfMonth),
        }
    }

    const getYearRange = (date: Date) => {
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1, 0, 0, 0, 0)
        const lastDayOfYear = new Date(date.getFullYear(), 11, 31, 23, 59, 59, 999)

        return {
            fecha_inicial: localDateToUTCString(firstDayOfYear),
            fecha_final: localDateToUTCString(lastDayOfYear),
        }
    }

    const getMonthName = (dateInput: string | Date, abreviado = false): string => {
        const meses = abreviado
            ? ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
            : [
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

        let date: Date
        if (typeof dateInput === "string") {
            date = new Date(dateInput)
        } else {
            date = dateInput
        }

        return abreviado ? meses[date.getUTCMonth()] : meses[date.getUTCMonth()]
    }

    // Para recibir
    const UTCStringToLocalDate = (UTCString?: string): Date => {
        if (!UTCString) {
            return new Date()
        }

        let date: DateTime | undefined = undefined

        try {
            if (UTCString.includes("T")) {
                // Caso ISO
                date = DateTime.fromISO(UTCString, { zone: zonehotel })
            } else if (UTCString.includes("+") && UTCString.includes(".")) {
                // PostgreSQL-style con microsegundos y zona
                // Ej: "2025-05-31 14:20:24.959725+00:00"
                const [main, zone] = UTCString.split("+")
                const [datePart, timePart] = main.split(" ")
                const [time, fraction] = timePart.split(".")
                const ms = fraction.slice(0, 3) // Solo 3 dígitos de los microsegundos
                const normalized = `${datePart} ${time}.${ms}+${zone}`

                date = DateTime.fromFormat(normalized, "yyyy-MM-dd HH:mm:ss.SSSZZ", { zone: zonehotel })
            } else {
                // Formato simple sin T ni Z
                date = DateTime.fromFormat(UTCString, "yyyy-MM-dd HH:mm:ss.SSS", { zone: zonehotel })
            }

            if (!date.isValid) throw new Error("Invalid date")

            const localDateTime = date.setZone(zonehotel)
            return localDateToOperableDate(localDateTime.toJSDate())
        } catch {
            return new Date()
        }
    }

    // Para enviar
    const localDateToUTCString = (localDate: Date): string => {
        const dateTime = DateTime.fromJSDate(localDate, { zone: zonehotel })
        if (!dateTime.isValid) {
            return new Date().toISOString().slice(0, -5)
        }
        return dateTime.toUTC().toISO().slice(0, -5)
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

    const formatLongDateFromUTCString = ({
        UTCString,
        withHoursAMPM = true,
    }: {
        UTCString: string
        withHoursAMPM: boolean
    }) => {
        return formatLongDate(new Date(UTCString), withHoursAMPM)
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
            const newHourDate = UTCStringToLocalDate(newHour)

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
        getDayHoursRange,
        getMonthRange,
        getMonthName,
        getYearRange
    }
}
