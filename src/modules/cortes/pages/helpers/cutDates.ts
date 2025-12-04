export function getFechaInicio(dates: Date[]): Date | null {
    if (dates.length === 0) return null
    return new Date(Math.min(...dates.map((d) => d.getTime())))
}

export function getFechaFin(dates: Date[]): Date | null {
    if (dates.length === 0) return null
    return new Date(Math.max(...dates.map((d) => d.getTime())))
}