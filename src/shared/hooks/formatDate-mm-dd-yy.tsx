export const formatDateShort = (date: Date | string): string => {
    if (typeof date === "string") {
        // Intenta convertir la cadena en una fecha
        date = new Date(date)
    }
    // Supongamos que tienes una fecha en una variable llamada "date"
    // Reemplaza esto con tu fecha
    if (!(date instanceof Date) || isNaN(date.getTime?.())) {
        // La conversión no fue exitosa, devolver una cadena vacía o manejar el error según corresponda
        return ""
    }
    // Array de nombres de meses abreviados
    const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]

    // Obtiene el nombre abreviado del mes
    const month = monthNames[date.getMonth()]

    // Obtiene el día y agrega un cero al principio si es necesario
    const day = date.getDate().toString().padStart(2, "0")

    // Obtiene el año
    const year = date.getFullYear()

    // Formatea la fecha en el formato deseado
    const formattedDate = `${month} ${day}, ${year}`

    return formattedDate
}
