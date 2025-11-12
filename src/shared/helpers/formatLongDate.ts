export const formatLongDate = (fecha?: Date, withHours = true, withDashBetween = true): string => {
    if (!(fecha instanceof Date)) {
        return "-"
    }
    const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]

    const dia = fecha.getDate()
    const mes = meses[fecha.getMonth()]
    const año = fecha.getFullYear()
    const hora = fecha.getHours()
    const minutos = fecha.getMinutes()
    const ampm = hora >= 12 ? "PM" : "AM"

    // Formatear la hora en formato 12 horas
    const hora12 = hora % 12 || 12

    // Agregar ceros iniciales a minutos si es necesario
    const minutosStr = minutos < 10 ? `0${minutos}` : `${minutos}`

    if (withHours) {
        const fechaFormateada = `${mes}, ${dia} ${año} ${withDashBetween ? "-" : ""} ${hora12}:${minutosStr} ${ampm}`
        return fechaFormateada
    }
    const fechaFormateada = `${mes}, ${dia} ${año}`
    return fechaFormateada
}
