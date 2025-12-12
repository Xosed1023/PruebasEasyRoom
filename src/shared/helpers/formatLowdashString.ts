export function formatLowdashString(str: string, capitalizeFirst = false): string {
    let formatted = str.replace(/_/g, " ")
    if (capitalizeFirst) {
        formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1)
    }
    return formatted
}
