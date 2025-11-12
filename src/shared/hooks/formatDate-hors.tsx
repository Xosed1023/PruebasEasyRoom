export const formatDateHors = (fecha: Date): string => {
    // Obtenemos la fecha actual
    const fechaActual = new Date()

    // Convertimos la fecha proporcionada a un número
    const fechaEnNumeros = fecha.getTime?.()

    // Restamos la fecha actual a la fecha proporcionada
    const diferencia = fechaActual.getTime?.() - fechaEnNumeros

    // Convertimos la diferencia a segundos
    const diferenciaEnSegundos = diferencia / 1000

    // Obtenemos la cantidad de horas
    const cantidadDeHoras = diferenciaEnSegundos / (60 * 60)
    // Redondeamos la cantidad de horas a un número entero
    const cantidadDeHorasEntera = Math.floor(cantidadDeHoras)

    // Formateamos la cantidad de horas
    const formato = `${cantidadDeHorasEntera} Hr`

    return formato
}
