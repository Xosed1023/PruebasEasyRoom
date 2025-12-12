import { useState, useEffect } from "react"
import { InputText } from "src/shared/components/forms"
import Icon from "src/shared/icons"
import { getCurrencyFormat } from "src/utils/string"

export interface Props {
    onChange: (value: number) => void
    value: number
    limit?: number
    error?: boolean
    className?: string
    errorhinttext?: string
    label?: string
    placeholder?: string
    disabled?: boolean
    icon?: string
}

export const InputCurrency = ({
    value,
    limit = undefined,
    onChange,
    error = false,
    errorhinttext = "",
    className = "",
    label = "Monto",
    disabled = false,
    placeholder = "Ingresa el monto",
    icon = "",
}: Props) => {
    const [lvalue, setValue] = useState<string>("")

    useEffect(() => {
        if (value > 0) {
            const moneyFormat = getCurrencyFormat(value)
            if (lvalue !== moneyFormat) {
                setValue(moneyFormat)
            }
        } else {
            setValue("")
        }
    }, [value])

    const handleChange = (value: string): void => {
        if (value) {
            const current = value.replace(/[^\d.]/g, "")
            if (current.split(".")?.[1]) {
                const [first, second] = current.split(".")
                setValue(`${first}.${second?.slice(0, 2)}`)
            } else {
                setValue(current)
            }
        } else {
            setValue("")
        }
    }

    const handleBlur = (value: string): void => {
        if (value) {
            const decimal = parseFloat(value)
            const exact = limit ? (decimal <= limit ? decimal : limit) : decimal
            const moneyFormat = getCurrencyFormat(exact)
            onChange(exact)
            setValue(moneyFormat)
        }
    }

    return (
        <InputText
            icon={Icon}
            inputWrapperClass={className}
            iconProps={{ name: icon ? icon : "currencyFill", height: 16, width: 16, color: "var(--header-dark)" }}
            label={label}
            type={"text"}
            placeholder={placeholder}
            value={lvalue}
            disabled={disabled}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={(e) => handleBlur(e.target.value)}
            onFocus={(e) => handleChange(e.target.value)}
            error={error}
            errorhinttext={errorhinttext}
        />
    )
}
