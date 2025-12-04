export const formatMatricula = (input: string) => {
    const cleaned = input.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 9)
    const segments = [cleaned.slice(0, 3), cleaned.slice(3, 6), cleaned.slice(6, 9)].filter(Boolean)

    return segments.join("-")
}

export const maskMatricula = (raw: string) => formatMatricula(raw)

export default maskMatricula
