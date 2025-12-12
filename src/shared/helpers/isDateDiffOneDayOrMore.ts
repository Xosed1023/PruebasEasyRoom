export const isDateDiffOneDayOrMore = (startDate: Date, endDate: Date): boolean => {
    // Calcula la diferencia en milisegundos entre las dos fechas
    const differenceInMilliseconds = endDate.getTime?.() - startDate.getTime?.()

    // Calcula la cantidad de días en la diferencia
    const daysDifference = differenceInMilliseconds / (1000 * 60 * 60 * 24)

    // Comprueba si la diferencia es de un día o más
    return daysDifference >= 1
}
