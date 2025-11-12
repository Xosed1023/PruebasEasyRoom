/**
 * funcion para transformar una fecha en utc en una compatible para enviar a la api rest como parámetro para sus endpoints
 * @param utcDate
 * @returns
 */
const FormatUTCDateToApiDate = (utcDate: string, includeMilliseconds: boolean) => {
    const base = utcDate?.replace("T", " ")?.replace("Z", "")

    if (includeMilliseconds) {
        // Asegura que tenga milisegundos, añadiendo ".000" si no están
        return /\.\d{3}/.test(base) ? base : base?.replace(/$/, ".000")
    } else {
        // Elimina milisegundos si existen
        return base?.replace(/\.\d{3}/, "")
    }
}

export default FormatUTCDateToApiDate
