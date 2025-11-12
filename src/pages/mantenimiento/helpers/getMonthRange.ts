export function getMonthRange(date: Date): { start: Date; end: Date } {
    const year = date.getFullYear()
    const month = date.getMonth()

    // Inicio del mes: día 1 a las 00:00:00
    const start = new Date(year, month, 1, 0, 0, 0)

    // Fin del mes: último día a las 23:59:59
    const end = new Date(year, month + 1, 0, 23, 59, 59, 999)

    return { start, end }
}
