export const getCurrentDateEndHour = (): string => {
    const date = new Date()

    // Establecer la hora a las 23:59:59:999 para obtener el tiempo final del día actual
    date.setHours(23, 59, 59, 999)

    return date.toISOString()
}
