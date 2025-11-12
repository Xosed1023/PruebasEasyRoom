export const useDateWithUTCHour = (startDate: Date, horaUTC?: string): Date => {
    if (!horaUTC) return new Date(startDate)

    const match = horaUTC.match(/^(\d{2}):(\d{2}):(\d{2})([+-]\d{2})$/)
    if (!match) return new Date(startDate)

    const [hh, mm, ss, offset] = match.slice(1)
    let horas = parseInt(hh, 10)
    const minutos = parseInt(mm, 10)
    const segundos = parseInt(ss, 10)
    const offsetHoras = parseInt(offset, 10)

    horas = horas + offsetHoras
    if (horas < 0) horas += 24
    if (horas >= 24) horas -= 24

    const d = new Date(startDate)
    d.setHours(horas, minutos, segundos, 0)
    return d
}
