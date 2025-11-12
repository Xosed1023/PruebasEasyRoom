import { useState, useEffect } from "react"
import { InputNumberProps } from "../DetalleCompra.type"

export const InputNumber = ({ value = "", onChange, error }: InputNumberProps) => {
    const [lvalue, setValue] = useState<string>("")

    useEffect(() => {
        if (value !== lvalue) setValue(value)
    }, [value])

    const handleChange = (value: string) => {
        if (value) {
            setValue(value.replace(/[^\d]/g, ""))
        } else {
            setValue("")
        }
    }

    const handleBlur = (value: string) => {
        if (value) {
            onChange(lvalue)
        } else {
            onChange("")
        }
    }

    return (
        <div className="detalle-compra__input-number-contain">
            <input
                className="detalle-compra__input-number"
                style={{ borderColor: error ? "var(--pink-ocupado)" : "var(--header)" }}
                type="text"
                value={lvalue}
                onChange={(e) => handleChange(e.target.value)}
                onFocus={(e) => handleChange(e.target.value)}
                onBlur={() => handleBlur(lvalue)}
            />
            {error && <span className="detalle-compra__input-number__error">{"No puede ser menor a 1"}</span>}
        </div>
    )
}
