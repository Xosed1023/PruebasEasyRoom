import React, { KeyboardEvent, useState } from "react"

import InputText from "../input-text/InputText"
import { InputTextProps } from "../input-text/input-text.props"

function formatMoney(input: string | "Backspace", currentText: string): string {
    const text = currentText
    // Expresión regular para validar el formato de la cadena
    const formatRegex = /^\d*\.?\d*$/

    
    
    if(input === "Backspace") {
        return currentText.slice(0, currentText.length - 1)
    }
    if(formatRegex.test(currentText.slice(1) + input)) {
        const textWithoutDollarSign = currentText.slice(1)
        
        return "$" + textWithoutDollarSign + input
    }
    return text
}

/** 
 * Input para recibir números decimales positivos sin dropdown de prefijo, con la flexibilidad de InputText
 * 
 */
const InputMoney = ({value, ...props}: Omit<InputTextProps, "type">) => {
    const [visibleValue, setVisibleValue] = useState("")

    const maskChange = (e: KeyboardEvent) => {
        setVisibleValue(formatMoney(e.key, visibleValue))
    }

    return (
        <InputText
            type="text"
            value={visibleValue}
            {...props}
            onKeyDown={maskChange}
            onChange={(e) => props?.onChange?.({ ...e, target: { ...e.target, value: visibleValue.slice(1) } })}
        />
    )
}

export default InputMoney
