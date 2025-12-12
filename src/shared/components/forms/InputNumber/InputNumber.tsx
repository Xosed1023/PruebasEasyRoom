import React, { ChangeEventHandler, KeyboardEvent, useEffect, useState } from "react"

import InputText from "../input-text/InputText"
import { InputTextProps } from "../input-text/input-text.props"

interface InputNumerProps extends Omit<InputTextProps, "type"> {
    allow0?: boolean
    limitLength?: number
    allowDecimals?: boolean
    maxDecimalsLength?: number
}

function formatNumber(
    input: string | "Backspace",
    currentText: string,
    allow0: boolean,
    allowDecimals: boolean,
    onChange?: ChangeEventHandler<HTMLInputElement>,
    limitLength?: number,
    maxDecimalsLength?: number
): string {
    const text = currentText;

    const formatRegex = allowDecimals ? /^-?\d*\.?\d*$/ : /^-?\d+$/;

    if (input === "Backspace") {
        onChange?.({ target: { value: "" } } as any);
        return currentText.slice(0, currentText.length - 1);
    }

    if (!!limitLength && currentText.length >= limitLength) {
        return currentText;
    }

    if (!allow0 && currentText.length === 0 && input === "0") {
        return "";
    }

    const nextValue = currentText + input;

    if (!formatRegex.test(nextValue)) {
        return text;
    }

    if (allowDecimals && maxDecimalsLength !== undefined) {
        const [, decimals = ""] = nextValue.split(".");
        if (decimals.length > maxDecimalsLength) {
            return text;
        }
    }

    return nextValue;
}


/**
 * Input para recibir números enteros y decimales, con la flexibilidad de InputText, icluye bandera para aceptar el 0 en total
 *
 */
const InputNumber = ({ value, allow0 = true, limitLength, allowDecimals = false, maxDecimalsLength = Infinity, ...props }: InputNumerProps) => {
    const [visibleValue, setVisibleValue] = useState(value?.toString() || "")

    useEffect(() => {
        setVisibleValue(value?.toString() || "")
    }, [value])

    const maskChange = (e: KeyboardEvent) => {
        setVisibleValue(formatNumber(e.key, visibleValue, allow0, allowDecimals, props.onChange, limitLength, maxDecimalsLength))
    }

    return (
        <InputText
            type="text"
            value={visibleValue}
            {...props}
            onKeyDown={maskChange}
            onChange={(e) => {
                props?.onChange?.({ ...e, target: { ...e.target, value: visibleValue } })
            }}
        />
    )
}

export default InputNumber
