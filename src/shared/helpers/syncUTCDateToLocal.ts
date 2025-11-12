const syncUTCDateToLocal = (dateUTC: Date) => {
    const anio = dateUTC.getUTCFullYear()
    const mes = (dateUTC.getUTCMonth() + 1).toString().padStart(2, "0")
    const dia = dateUTC.getUTCDate().toString().padStart(2, "0")
    const hora = dateUTC.getUTCHours().toString().padStart(2, "0")
    const minutos = dateUTC.getUTCMinutes().toString().padStart(2, "0")
    const segundos = dateUTC.getUTCSeconds().toString().padStart(2, "0")

    // Formatear la cadena de salida en formato UTC
    return `${anio}-${mes}-${dia}T${hora}:${minutos}:${segundos}`
}

export default syncUTCDateToLocal
