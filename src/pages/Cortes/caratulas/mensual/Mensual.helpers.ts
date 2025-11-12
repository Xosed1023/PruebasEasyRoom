export const getDateFilters = (year: number) => {
    const date = new Date()

    return {
        fecha_inicial: new Date(year, 0, 1).toISOString(),
        fecha_final: new Date(
            year,
            year === date.getFullYear() ? date.getMonth() : 11,
            year === date.getFullYear() ? date.getDate() : 31,
            59,
            59,
            59,
            59
        ).toISOString(),
    }
}
