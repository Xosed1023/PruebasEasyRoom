export const elapsedTimePercent = (startDate: Date, endDate: Date) => {
    const startDateCopy = new Date(startDate.getTime?.())
    const endDateCopy = new Date(endDate.getTime?.())
    const fechaActual = new Date()

    // Calcula la diferencia entre la fecha de inicio y la fecha actual
    const tiempoTranscurrido = fechaActual.getTime?.() - startDateCopy.getTime?.()

    // Calcula la diferencia total entre la fecha de inicio y la fecha de finalización
    const tiempoTotal = endDateCopy.getTime?.() - startDateCopy.getTime?.()

    // Calcula el porcentaje de avance
    const percent = (tiempoTranscurrido / tiempoTotal) * 100

    // Asegura que el porcentaje esté dentro del rango [0, 100]
    if (percent < 0) {
        return 0
    } else if (percent > 100) {
        return 100
    }

    return Math.round(percent)
}
