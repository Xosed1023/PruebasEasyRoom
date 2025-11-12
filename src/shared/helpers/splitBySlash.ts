export function splitBySlash(input: string): (string[] | [string, string])[] {
    return input.split(",").map((part) => {
        const trimmed = part.trim()
        const match = trimmed.match(/^(.+?)\s*\/\s*(.+)$/)
        if (match) {
            return [match[1].trim(), match[2].trim()]
        } else {
            return [trimmed]
        }
    })
}
