import { useState, useEffect, FocusEventHandler } from "react"
import { InputText } from "src/shared/components/forms"
import Icon from "src/shared/icons"
import { validateOnlyNumbers } from "./Payment.helpers"

type InputCardNumberProps = {
    onChange: (value: string) => void
    value: string
    error?: boolean
    disabled?: boolean
    errorhinttext?: string
    label?: string
    icon?: "hash01" | "iconHash" | (string & {})
    className?: string
    placeholder?: string
    testId?: string
    onFocus?: FocusEventHandler<HTMLInputElement>
    onBlur?: FocusEventHandler<HTMLInputElement>
}

export const InputCardNumber = ({
    value = "",
    error = false,
    disabled = false,
    className,
    errorhinttext = "Ingresa mínimo 4 dígitos",
    label = "Número de tarjeta o referencia",
    onChange,
    icon = "hash01",
    placeholder,
    testId = "input-card",
    onFocus,
    onBlur,
}: InputCardNumberProps) => {
    const [lvalue, setValue] = useState<string>("")

    useEffect(() => {
        if (value !== lvalue) setValue(value)
    }, [value])

    return (
        <InputText
            label={label}
            className={className}
            type={"text"}
            placeholder={placeholder || "Máximo 10 dígitos"}
            errorhinttext={errorhinttext}
            error={error}
            value={lvalue}
            icon={Icon}
            disabled={disabled}
            data-testid={testId}
            iconProps={{
                name: icon,
                color: "var(--header-dark)",
                height: 16,
                width: 16,
            }}
            onChange={(e) => {
                const value = e.target.value
                if (validateOnlyNumbers(value, 10)) {
                    setValue(value)
                    onChange(value)
                }
            }}
            onKeyPress={(e) => {
                if (e.key === "Enter") e.preventDefault()
            }}
            onFocus={onFocus}
            onBlur={onBlur}
        />
    )
}
