import { KeyboardEvent, useState } from "react"

function formatTel(input: string | "Backspace", currentText: string): string {
    const placeholder = "(__) ____ ____"
    const currentChars = currentText.length ? currentText.split("") : placeholder.split("")
    const placeholderChars = placeholder.split("")

    const hasNumbers = currentChars.some((char, index) => placeholderChars[index] === "_" && char !== "_")

    if (!/^\d+$/.test(input) && input !== "Backspace") {
        if (!hasNumbers) return ""
        return currentText
    }

    if (input === "Backspace" && !hasNumbers) return ""

    if (input === "Backspace") {
        for (let i = currentChars.length - 1; i >= 0; i--) {
            if (placeholderChars[i] === "_" && currentChars[i] !== "_") {
                currentChars[i] = "_"
                break
            }
        }
    } else if (typeof input === "string" && /^\d$/.test(input)) {
        for (let i = 0; i < currentChars.length; i++) {
            if (placeholderChars[i] === "_" && currentChars[i] === "_") {
                currentChars[i] = input
                break
            }
        }
    }

    return currentChars.join("")
}

function normalizePhone(input: string): string {
    // const placeholder = "(__) ____ ____"
    const digits = input.replace(/\D/g, "").slice(0, 10) // Máximo 10 dígitos

    const d = digits.split("")
    // Llenar los faltantes con "_"
    while (d.length < 10) {
        d.push("_")
    }

    // Formatear al estilo "(XX) XXXX XXXX"
    return `(${d[0]}${d[1]}) ${d[2]}${d[3]}${d[4]}${d[5]} ${d[6]}${d[7]}${d[8]}${d[9]}`
}

const useMaskTel = () => {
    const [value, setValue] = useState<string>("")

    const maskChange = (e: KeyboardEvent | string) => {
        if (typeof e === "string") {
            const formatted = normalizePhone(e)
            setValue(formatted)
            return
        }
        setValue(formatTel(e.key, value))
    }

    const manualChange = (v: string) => {
        const formatted = normalizePhone(v)
        setValue(formatted)
    }

    return {
        maskChange,
        manualChange,
        value,
    }
}

export default useMaskTel
