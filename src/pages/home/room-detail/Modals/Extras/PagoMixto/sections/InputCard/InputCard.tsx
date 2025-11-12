import { useState, useEffect } from "react"
import { InputText } from "src/shared/components/forms"
import Icon from "src/shared/icons"
import { validateOnlyNumbers } from "src/shared/sections/payment/Payment.helpers"

type InputCardNumberProps = {
    onChange: (value: string) => void
    value: string
    error?: boolean
    errorhinttext?: string
    className?: string
    label?: string
    icon?: "hash01" | "iconHash" | (string & {})
}

export const InputCard = ({
    value = "",
    error = false,
    errorhinttext = "Ingresa los últimos 4 dígitos",
    label = "Número de tarjeta",
    onChange,
    className = "",
    icon = "hash01",
}: InputCardNumberProps) => {
    const [lvalue, setValue] = useState<string>("")

    useEffect(() => {
        if (value !== lvalue) setValue(value)
    }, [value])

    return (
        <InputText
            label={label}
            type={"text"}
            inputWrapperClass={className}
            placeholder={"Últimos 4 digitos"}
            errorhinttext={errorhinttext}
            error={error}
            value={lvalue}
            icon={Icon}
            iconProps={{
                name: icon,
                color: "var(--header-dark)",
                height: 16,
                width: 16,
            }}
            onChange={(e) => {
                const value = e.target.value
                if (validateOnlyNumbers(value, 4)) {
                    setValue(value)
                    onChange(value)
                }
            }}
            onKeyPress={(e) => {
                if (e.key === "Enter") e.preventDefault()
            }}
        />
    )
}
