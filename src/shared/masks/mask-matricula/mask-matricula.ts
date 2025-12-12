import { KeyboardEvent, useState } from "react"

export const formatMatricula = (input: string | "Backspace", currentText: string) => {
    let text = currentText
    const formatRegex = /^[a-zA-Z0-9]+$/

    if (input === "Backspace") {
        if (text.length === 4 || text.length === 8) {
            text = text.substring(0, text.length - 2)
            return text
        }
        text = text.substring(0, text.length - 1)
        return text
    } else if (input.length === 1 && formatRegex.test(input)) {
        if (text.length >= 9) {
            return text
        }
        if (text.length === 2) {
            return `${text}${input.toUpperCase()}-`
        }
        if (text.length === 7) {
            return `${text}-${input.toUpperCase()}`
        }
        return text + input.toUpperCase()
    }
    return text
}

const useMaskMatricula = () => {
    const [value, setValue] = useState("")

    const maskChange = (e: KeyboardEvent) => {
        setValue(formatMatricula(e.key, value))
    }

    const manualChange = (v: string) => {
        setValue(v)
    }
    return {
        maskChange,
        manualChange,
        value,
    }
}

export default useMaskMatricula
