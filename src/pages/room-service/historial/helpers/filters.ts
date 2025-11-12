export const getDateFilters = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const day = date.getDate()

    return {
        fecha_final: new Date(year, month, day, 24).toISOString(),
        fecha_inicial: new Date(year, month, day, 0).toISOString(),
    }
}
