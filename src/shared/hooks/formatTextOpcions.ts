export const formatText = (input: string): string => {
    const inputFormat = input.replaceAll("_", " ")
    return inputFormat.replaceAll(/\b[a-z]/g, (match) => match.toUpperCase())
}
