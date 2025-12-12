export const getDateFilters = (date: Date) => {
    return {
        fecha_inicial: new Date(date.getFullYear(), date.getMonth(), 1).toISOString(),
        fecha_final: new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 59).toISOString(),
    }
}
