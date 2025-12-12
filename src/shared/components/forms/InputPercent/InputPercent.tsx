import React, { KeyboardEvent, useState } from "react"

import InputText from "../input-text/InputText"
import { InputTextProps } from "../input-text/input-text.props"

function formatPercent(input: string | "Backspace", currentText: string, withSymbol: boolean): string {
    const textWithoutPercentSign = currentText.replace("%", "")

    // Expresión regular para validar el formato de la cadena como un porcentaje
    const formatRegex = /^\d*\.?\d*$/

    if (input === "Backspace") {
        return textWithoutPercentSign.slice(0, textWithoutPercentSign.length - 1) + (withSymbol ? "%" : "")
    }

    if (formatRegex.test(textWithoutPercentSign + input)) {
        return textWithoutPercentSign + input + (withSymbol ? "%" : "")
    }

    return currentText
}

/**
 * Input para recibir números decimales positivos sin dropdown de prefijo, con la flexibilidad de InputText
 *
 */

interface InputPercentProps extends Omit<InputTextProps, "type"> {
withSymbol?: boolean
}

const InputPercent = ({ value, withSymbol = true, ...props }: InputPercentProps) => {
    const [visibleValue, setVisibleValue] = useState("")

    const maskChange = (e: KeyboardEvent) => {
        setVisibleValue(formatPercent(e.key, visibleValue, withSymbol))
    }

    return (
        <InputText
            type="text"
            value={value}
            {...props}
            onKeyDown={maskChange}
            onChange={(e) => props?.onChange?.({ ...e, target: { ...e.target, value: visibleValue } })}
        />
    )
}

export default InputPercent
