import React, { KeyboardEvent, useState } from "react"

import "./InputDateText.css"
import InputText from "../input-text/InputText"
import CalendarFill from "src/shared/icons/CalendarFill"
import { InputTextProps } from "../input-text/input-text.props"

function formatDate(input: string | "Backspace", currentText: string): string {
    let text = currentText
    // Expresión regular para validar el formato de la cadena
    const formatRegex = /^(\d{0,2}|D{0,2}|M{0,2}|A{0,4})(\/(\d{0,2}|D{0,2}|M{0,2}|A{0,4})){0,2}$/

    // Verificar si el input es "Backspace"
    if (input === "Backspace") {
        // Reemplazar el último carácter de currentText con 'D', 'M' o 'A' según sea el caso
        const replacementChar = currentText.slice(-1) === "D" ? "M" : currentText.slice(-1) === "M" ? "A" : "D"
        text = text.replace(/.$/, replacementChar)
        if (!text.includes("A")) {
            const newText = text.substring(0, text.length - 4) + "AAAA"
            return newText
        }
        if (!text.includes("M")) {
            const newText = text.substring(0, text.length - 7) + "MM/AAAA"
            return newText
        }
        return "DD/MM/AAAA"
    } else if (typeof Number(input) === "number" && Number(input) >= 0 && Number(input) <= 9) {
        // Reemplazar el primer carácter diferente con el nuevo número
        if (text.includes("D")) {
            text = text.replace("D", input)
            return text
        }
        if (text.includes("M")) {
            text = text.replace("M", input)
            return text
        }
        if (text.includes("A")) {
            text = text.replace("A", input)
            return text
        }
    }

    // Validar el formato de la cadena después de las modificaciones
    if (!formatRegex.test(text)) {
        // Si no cumple con el formato, devolver el texto original
        return currentText
    }
    return text
}

const InputDateText = (props: InputTextProps) => {
    const [value, setValue] = useState("DD/MM/AAAA")

    const maskChange = (e: KeyboardEvent) => {
        setValue(formatDate(e.key, value))
    }

    return (
        <InputText
            value={value}
            {...props}
            icon={CalendarFill}
            onKeyDown={maskChange}
            onChange={(e) => props?.onChange?.({ ...e, target: { ...e.target, value } })}
        />
    )
}

export default InputDateText

export const validateInputDateText = (value = "DD/MM/AAAA", errorText: string) => {
    const [dia, mes, anio] = value.split("/").map(Number)
    const fecha = new Date(anio, mes - 1, dia)

    const fecha_fin = new Date(2024, 0, 1, 0, 0, 0, 0).getTime()
    const fecha_inicio = new Date(1900, 0, 1, 0, 0, 0, 0).getTime()

    const valid = !isNaN(fecha.getTime()) && fecha.getTime() > fecha_inicio && fecha.getTime() < fecha_fin

    if (
        value.includes("D") ||
        value.includes("M") ||
        value.includes("A") ||
        !(fecha.getDate() === dia && fecha.getMonth() === mes - 1 && fecha.getFullYear() === anio)
    ) {
        return errorText
    }
    if (!valid) return errorText
    return true
}

export const InputDateTextisValid = (value = "DD/MM/AAAA") => {
    const [dia, mes, anio] = value.split("/").map(Number)
    const fecha = new Date(anio, mes - 1, dia)
    return (
        value.includes("D") ||
        value.includes("M") ||
        value.includes("A") ||
        !(fecha.getDate() === dia && fecha.getMonth() === mes - 1 && fecha.getFullYear() === anio)
    )
}
