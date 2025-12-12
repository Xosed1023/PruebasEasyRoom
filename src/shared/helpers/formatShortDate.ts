export const formatShortDate = (date: Date, fullYear?: boolean): string => {
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0") // Los meses se indexan desde 0
    const year = String(date.getFullYear()).slice(fullYear ? 0 : -2) // Tomar los últimos dos dígitos del año

    return `${day}/${month}/${year}`
}
