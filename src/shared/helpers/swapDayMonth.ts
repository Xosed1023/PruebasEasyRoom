/**
 *
 * @param fechaOriginal recibida en formato "DD/MM/AAAA" y lo transforma a "MM/DD/AAAA" para poder tranformarlo a fecha y que sea la fecha real
 * @returns
 */
export const swapDayMonth = (fechaOriginal: string): string => {
    // Dividir la fecha en día, mes y año
    const partsDate = fechaOriginal.split("/")

    // Obtener el día, el mes y el año en el nuevo formato
    const newDate = `${partsDate[1]}/${partsDate[0]}/${partsDate[2]}`

    return newDate
}
