import { DateTime } from "luxon"
/**
 * Transforma horas en forma de texto de la forma: HH:MM:SS+HH o HH:MM:SS-HH a la fecha en hora local, sin cambiar el día.
 */
export const parseTimeString = (timeString: string): Date => {
    const horaUTC = DateTime.fromISO(timeString, { zone: "utc" })

    // Convertir a la zona horaria de cada hotel
    const horaCDMX = horaUTC.setZone("America/Mexico_City")
    if (horaCDMX.day !== DateTime.now().day) {
        // Si el ajuste a la hora local hace cambiar el día, reestablecer al día de hoy
        return horaCDMX
            .set({
                day: DateTime.now().day,
                month: DateTime.now().month,
                year: DateTime.now().year,
            })
            .toJSDate()
    }

    return horaCDMX.toJSDate()
}
