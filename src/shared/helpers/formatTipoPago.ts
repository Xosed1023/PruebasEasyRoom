
export const formatTipoPago = (text: string) => {
    const inputFormat = text.replaceAll("_", " ")
    return inputFormat.replaceAll(/\b[a-z]/g, (match) => match.toUpperCase())
}