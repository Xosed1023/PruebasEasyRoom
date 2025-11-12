import { KeyboardEvent, useState } from "react"

function formatTel(input: string | "Backspace", currentText: string): string {
    const placeholder = "(__) ____ ____" // Define el formato base
    const currentChars = currentText.length ?  currentText.split("") : placeholder.split("") // Divide el texto actual en un arreglo de caracteres
    const placeholderChars = placeholder.split("") // Divide el placeholder en un arreglo de caracteres

    
    // Si no hay números escritos aún, devolver texto vacío al presionar "Backspace"
    const hasNumbers = currentChars.some((char, index) => placeholderChars[index] === "_" && char !== "_")

    if(!/^\d+$/.test(input) && input !== "Backspace") {
        if(!hasNumbers) {
            return ""
        }
        return currentText
    }

    if (input === "Backspace" && !hasNumbers) {
        return ""
    }

    if (input === "Backspace") {
        // Encuentra el último carácter ingresado que no sea parte del formato
        for (let i = currentChars.length - 1; i >= 0; i--) {
            if (placeholderChars[i] === "_" && currentChars[i] !== "_") {
                currentChars[i] = "_" // Borra el carácter actual
                break
            }
        }
    } else if (typeof input === "string" && /^\d$/.test(input)) {
        // Encuentra el primer espacio "_" y lo reemplaza con el número ingresado
        for (let i = 0; i < currentChars.length; i++) {
            if (placeholderChars[i] === "_" && currentChars[i] === "_") {
                currentChars[i] = input // Inserta el número
                break
            }
        }
    }

    return currentChars.join("") // Devuelve el texto actualizado
}

const useMaskTel = () => {
    const [value, setValue] = useState("(__) ____ ____")

    const maskChange = (e: KeyboardEvent) => {
        setValue(formatTel(e.key, value))
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

export default useMaskTel
