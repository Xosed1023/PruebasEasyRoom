const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]

const getMonthWithDay = (date: Date) => {
    return `${months[date.getMonth()]}, ${date.getDate()}`
}

export const getDateTitle = (date: Date) => {
    return `${getMonthWithDay(date)} ${date.getFullYear()}`
}
export const getDateTitleForList = (start: string, end: string) => {
    const fecha_inicio = new Date(start)
    const fecha_fin = new Date(end)

    return start && end
        ? fecha_inicio.getDate() !== fecha_fin.getDate() || fecha_inicio.getMonth() !== fecha_fin.getMonth()
            ? `${getMonthWithDay(fecha_inicio)} a ${getMonthWithDay(fecha_fin)} ${fecha_inicio.getFullYear()}`
            : getDateTitle(fecha_inicio)
        : getDateTitle(new Date())
}
