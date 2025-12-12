import { useState, useEffect } from "react"
import InputText from "src/shared/components/forms/input-text/InputText"
import { InputTextProps } from "src/shared/components/forms/input-text/input-text.props"
import { getCurrencyDecimalFormat } from "src/utils/string"
import Icon from "src/shared/icons"

type T = Omit<InputTextProps, "onChange" | "icon" | "type">

export interface Props extends T {
    onChange: (value: number) => void
    onChangeFocus?: () => void
    onChangeBlur?: (value: number) => void
    value: number
    limit?: number
    error?: boolean
    errorhinttext?: string
    label?: string
    placeholder?: string
    disabled?: boolean
    icon?: string
    withIcon?: boolean
    whiteSpace?: boolean
    negative?: boolean
    limitAfterPoint?: number | null
    testId?: string
}

export const InputCurrency = ({
    value,
    limit = undefined,
    onChange,
    error = false,
    errorhinttext = "",
    label = "Monto",
    disabled = false,
    placeholder = "Ingresa el monto",
    icon = "",
    whiteSpace = false,
    withIcon = true,
    negative = false,
    limitAfterPoint = 2,
    onChangeBlur,
    onChangeFocus,
    testId = "input-currency",
    ...rest
}: Props) => {
    const [lvalue, setValue] = useState<string>("")

    useEffect(() => {
        if (negative) {
            handleSet(value)
        } else if (value > 0) {
            handleSet(value)
        } else {
            setValue(whiteSpace ? "" : "0")
        }
    }, [value])

    const handleSet = (value: number) => {
        const moneyFormat = getCurrencyDecimalFormat(value, limitAfterPoint)
        if (lvalue !== moneyFormat) {
            setValue(moneyFormat)
        }
    }

    const handleChange = (value: string): void => {
        if (value) {
            // solo números y borra el "0" en la posición 0
            const current = value.replace(/[^-\d.]/g, "").replace(/^0/, "")
            if (current.split(".")?.[1]) {
                const [first, second] = current.split(".")
                setValue(`${first}.${limitAfterPoint ? second.slice(0, limitAfterPoint) : second}`)
            } else {
                setValue(current)
            }
        } else {
            setValue(whiteSpace ? "" : "0")
        }
    }

    const handleBlur = (value: string): void => {
        if (value) {
            const decimal = parseFloat(value)
            const exact = limit ? (decimal <= limit ? decimal : limit) : decimal
            const moneyFormat = getCurrencyDecimalFormat(exact, limitAfterPoint)
            onChange(exact)
            setValue(moneyFormat)
            onChangeBlur?.(exact)
        } else {
            onChangeBlur?.(0)
        }
    }

    return (
        <InputText
            icon={withIcon ? Icon : undefined}
            iconProps={
                withIcon
                    ? { name: icon ? icon : "currencyFill", height: 16, width: 16, color: "var(--header-dark)" }
                    : undefined
            }
            className={"input-currency__input"}
            label={label}
            placeholder={placeholder}
            value={lvalue}
            disabled={disabled}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={(e) => handleBlur(e.target.value)}
            onFocus={(e) => {
                handleChange(e.target.value)
                onChangeFocus?.()
            }}
            error={error}
            errorhinttext={errorhinttext}
            type={"text"}
            data-testid={testId}
            {...rest}
        />
    )
}
