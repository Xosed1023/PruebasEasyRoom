export const formatDateToTimeHHMMSS = (date: Date): string => {
    // Extraer horas, minutos y segundos
    const hours = date.getHours().toString().padStart(2, "0")
    const minutes = date.getMinutes().toString().padStart(2, "0")
    const seconds = date.getSeconds().toString().padStart(2, "0")

    // Formatear la cadena en HH:MM:SS
    return `${hours}:${minutes}:${seconds}`
}
