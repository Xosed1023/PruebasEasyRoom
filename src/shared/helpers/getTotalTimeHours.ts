
export const getTotalTimeHours = (fechaInicio: Date, fechaFin: Date): number => {
    // Calcula la diferencia en milisegundos entre las dos fechas
    const diferenciaEnMilisegundos = fechaFin.getTime?.() - fechaInicio.getTime?.()

    // Calcula la diferencia en horas dividiendo por la cantidad de milisegundos en una hora
    const diferenciaEnHoras = diferenciaEnMilisegundos / 36e5 //36e5 obtain hours

    return Math.round(diferenciaEnHoras)
}
