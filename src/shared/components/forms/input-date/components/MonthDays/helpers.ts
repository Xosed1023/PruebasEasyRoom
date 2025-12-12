export const isLeapYear = (year: number): boolean => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
export const getFebDays = (year: number): number => (isLeapYear(year) ? 29 : 28)

export const getNextMonth = (month: number): number => {
    return month === 11 ? 0 : month + 1
}

export const getNextYearByMonth = ({ month, year }: { month: number; year: number }): number => {
    return month === 11 ? year + 1 : year
}

export const getPrevMonth = (month: number): number => {
    return month === 0 ? 11 : month - 1
}

export const getPrevYearByMonth = ({ month, year }: { month: number; year: number }): number => {
    return month === 0 ? year - 1 : year
}

export const getWeekDay = (date: Date) => date.getDay()

export const mapMonthNumToText = (month: number) => {
    const months = {
        0: "Enero",
        1: "Febrero",
        2: "Marzo",
        3: "Abril",
        4: "Mayo",
        5: "Junio",
        6: "Julio",
        7: "Agosto",
        8: "Septiembre",
        9: "Octubre",
        10: "Noviembre",
        11: "Diciembre",
    }

    return months[month]
}

export const mapMonthNumToShortText = (month: number) => {
    const months = {
        0: "Enero",
        1: "Febrero",
        2: "Marzo",
        3: "Abril",
        4: "Mayo",
        5: "Junio",
        6: "Julio",
        7: "Agosto",
        8: "Septiembre",
        9: "Octubre",
        10: "Noviembre",
        11: "Diciembre",
    }

    return months[month].slice(0, 3)
}

export const getDaysByMonth = ({ month, year }: { month: number; year: number }) => {
    const daysByMonth = {
        0: 31,
        1: getFebDays(year),
        2: 31,
        3: 30,
        4: 31,
        5: 30,
        6: 31,
        7: 31,
        8: 30,
        9: 31,
        10: 30,
        11: 31,
    }

    return daysByMonth[month]
}

// Mapear los días que faltan para llegar al domingo iniciando desde el lunes porque así es como está el calendario
export const daysUntilSundayForwards = (dayOfWeek: number): number => {

    if(dayOfWeek === 0) {
        return 0
    }

    return 7 - dayOfWeek
}

export const daysUntilMondayBackwards = (dayOfWeek: number): number => {
    if(dayOfWeek === 0) {
        return 6
    }

    return dayOfWeek - 1
}
