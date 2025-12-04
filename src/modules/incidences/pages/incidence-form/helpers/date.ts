const months: string[] = [
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

export function getDateSlashFormat(date: Date): string {
    return `${String(date.getDate()).padStart(2, "0")} / ${months?.[date.getMonth()]} / ${date.getFullYear()}`
}
