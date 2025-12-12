import { DateTime } from "luxon"
import { useProfile } from "./useProfile"

/**
 * Hook para formatear fechas dinámicamente con cualquier formato
 * Utiliza la zona horaria del perfil del usuario automáticamente
 *
 * @example
 * const { formatDate } = useFormatDate()
 * Ejemplo de uso:
 * formatDate(new Date(), "YYYY-MM-DD HH:mm:ss")
 */
export const useFormatDate = () => {
    const { zona_horaria } = useProfile()
    const zonehotel = zona_horaria || "America/Mexico_City"

    /**
     * Formatea una fecha usando una máscara personalizada con reemplazo directo
     * Este método permite un formateo totalmente flexible usando tokens personalizados
     *
     * @param fecha - Puede ser Date, string ISO, o timestamp
     * @param mask - Máscara con tokens a reemplazar. Ejemplos:
     *   - "YYYY-MM-DD HH:mm:ss" → 2025-11-25 14:30:45
     *   - "DD/MM/YY hh:mm:ss:SSS" → 25/11/25 02:30:45:123
     *   - "MMMM DD, YYYY" → noviembre 25, 2025
     *   - "DDD, DD de MMMM de YYYY" → lunes, 25 de noviembre de 2025
     *   - "DD/MM/YYYY hh:mm A" → 25/11/2025 02:30 PM
     *
     * Tokens disponibles (case-sensitive):
     *   AÑOS:
     *     - YYYY: año completo 4 dígitos (2025)
     *     - YY: año corto 2 dígitos (25)
     *
     *   MESES:
     *     - MMMM: nombre completo del mes (noviembre, enero)
     *     - MMM: nombre abreviado del mes (nov, ene)
     *     - MM: mes con 2 dígitos (01-12)
     *     - M: mes sin cero inicial (1-12)
     *
     *   DÍAS:
     *     - DD: día con 2 dígitos (01-31)
     *     - D: día sin cero inicial (1-31)
     *
     *   DÍA DE LA SEMANA:
     *     - DDDD: nombre completo (lunes, martes)
     *     - DDD: nombre abreviado (lun, mar)
     *
     *   HORAS 24H:
     *     - HH: hora 24h con 2 dígitos (00-23)
     *     - H: hora 24h sin cero inicial (0-23)
     *
     *   HORAS 12H:
     *     - hh: hora 12h con 2 dígitos (01-12)
     *     - h: hora 12h sin cero inicial (1-12)
     *
     *   MINUTOS:
     *     - mm: minutos con 2 dígitos (00-59)
     *     - m: minutos sin cero inicial (0-59)
     *
     *   SEGUNDOS:
     *     - ss: segundos con 2 dígitos (00-59)
     *     - s: segundos sin cero inicial (0-59)
     *
     *   MILISEGUNDOS:
     *     - SSS: milisegundos con 3 dígitos (000-999)
     *     - SS: milisegundos con 2 dígitos (00-99)
     *     - S: milisegundos con 1 dígito (0-9)
     *
     *   AM/PM:
     *     - A: AM/PM en mayúsculas
     *     - a: am/pm en minúsculas
     *
     * @param locale - Idioma para nombres de meses/días (default: "es-MX")
     * @returns Fecha formateada según la máscara, o "-" si la fecha es inválida
     *
     * @example
     * formatCustomDate(new Date(), "YYYY-MM-DD HH:mm:ss")
     * // → "2025-11-25 14:30:45"
     *
     * formatCustomDate(new Date(), "DD/MM/YY hh:mm:ss A")
     * // → "25/11/25 02:30:45 PM"
     *
     * formatCustomDate(new Date(), "DDD, DD de MMMM de YYYY")
     * // → "lun, 25 de noviembre de 2025"
     *
     * formatCustomDate(new Date(), "YYYY-MM-DD'T'HH:mm:ss.SSS")
     * // → "2025-11-25T14:30:45.123"
     */
    const formatCustomDate = (
        fecha: Date | string | number | undefined | null,
        mask: string,
        locale = "es-MX"
    ): string => {
        if (!fecha) return "-"

        try {
            let dateTime: DateTime = undefined as any

            // Manejar diferentes tipos de entrada
            if (typeof fecha === "string") {
                // "YYYY-MM-DD" → NO usar fromISO (rompe la fecha por zonas)
                if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
                    const [year, month, day] = fecha.split("-").map(Number)
                    dateTime = DateTime.fromObject({ year, month, day })
                } else {
                    dateTime = DateTime.fromISO(fecha)
                }
            } else if (typeof fecha === "number") {
                dateTime = DateTime.fromMillis(fecha)
            } else if (fecha instanceof Date) {
                dateTime = DateTime.fromJSDate(fecha)
            } else {
                return "-"
            }

            // Aplicar zona horaria del hotel y locale
            let zonedDateTime = dateTime.setLocale(locale)

            // Si la fecha tenía hora → entonces sí aplicamos zona
            const needsTimezone =
                mask.includes("H") ||
                mask.includes("h") ||
                mask.includes("A") ||
                mask.includes("a")

            if (needsTimezone) {
                zonedDateTime = zonedDateTime.setZone(zonehotel)
            }

            // Nombres de meses y días de la semana en español
            const mesesCompletos = [
                "Enero",
                "Febrero",
                "Marzo",
                "Abril",
                "Mayo",
                "Junio",
                "Julio",
                "Agosto",
                "Septiembre",
                "Octubre",
                "Noviembre",
                "Diciembre",
            ]
            const mesesCortos = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
            const diasCompletos = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
            const diasCortos = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

            // Obtener valores de la fecha directamente de Luxon (ya zonificada)
            const year = zonedDateTime.year
            const month = zonedDateTime.month
            const day = zonedDateTime.day
            const dayOfWeek = zonedDateTime.weekday % 7 // Luxon usa 1-7 (lun-dom), convertir a 0-6 (dom-sáb)
            const hours24 = zonedDateTime.hour
            const hours12 = hours24 % 12 || 12
            const minutes = zonedDateTime.minute
            const seconds = zonedDateTime.second
            const milliseconds = zonedDateTime.millisecond
            const isPM = hours24 >= 12

            // Crear objeto con todos los reemplazos posibles
            // IMPORTANTE: El orden importa - los tokens más largos primero
            const replacements: Array<[string, string]> = [
                // Año
                ["YYYY", year.toString()],
                ["YY", year.toString().slice(-2)],

                // Mes
                ["MMMM", mesesCompletos[month - 1]],
                ["MMM", mesesCortos[month - 1]],
                ["MM", month.toString().padStart(2, "0")],
                ["M", month.toString()],

                // Día de la semana
                ["DDDD", diasCompletos[dayOfWeek]],
                ["DDD", diasCortos[dayOfWeek]],

                // Día del mes
                ["DD", day.toString().padStart(2, "0")],
                ["D", day.toString()],

                // Horas 24h
                ["HH", hours24.toString().padStart(2, "0")],
                ["H", hours24.toString()],

                // Horas 12h
                ["hh", hours12.toString().padStart(2, "0")],
                ["h", hours12.toString()],

                // Minutos
                ["mm", minutes.toString().padStart(2, "0")],
                ["m", minutes.toString()],

                // Segundos
                ["ss", seconds.toString().padStart(2, "0")],
                ["s", seconds.toString()],

                // Milisegundos
                ["SSS", milliseconds.toString().padStart(3, "0")],
                ["SS", milliseconds.toString().padStart(3, "0").slice(0, 2)],
                ["S", milliseconds.toString().padStart(3, "0").slice(0, 1)],

                // AM/PM
                ["A", isPM ? "PM" : "AM"],
                ["a", isPM ? "pm" : "am"],
            ]

            // Aplicar todos los reemplazos usando un método que evita reemplazar dentro de valores ya reemplazados
            // Usamos marcadores únicos con caracteres especiales que no aparecerán en fechas
            let result = mask
            const tempMarkers = new Map<string, string>()

            // Primero, reemplazar cada token con un marcador temporal único
            for (let i = 0; i < replacements.length; i++) {
                const [token, value] = replacements[i]
                // Usar caracteres especiales que no aparecerán en ninguna máscara de fecha
                const marker = `\u0000${i}\u0001`
                result = result.split(token).join(marker)
                tempMarkers.set(marker, value)
            }

            // Luego, reemplazar todos los marcadores con sus valores reales
            tempMarkers.forEach((value, marker) => {
                result = result.split(marker).join(value)
            })

            return result
        } catch (error) {
            console.error("Error formateando fecha con máscara:", error)
            return "-"
        }
    }

    /**
     * Obtiene la zona horaria actual del perfil
     */
    const getTimezone = (): string => {
        return zonehotel
    }

    return {
        formatCustomDate,
        getTimezone,
    }
}
