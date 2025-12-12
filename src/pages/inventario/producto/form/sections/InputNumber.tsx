import InputText from "src/shared/components/forms/input-text/InputText"
import { InputTextProps } from "src/shared/components/forms/input-text/input-text.props"

type T = Omit<InputTextProps, "onChange">

interface InputNumberPropsC extends T {
    value: string
    decimals?: boolean
    onChange: (value: string) => void
}

export const InputNumber = ({ value = "", onChange, decimals = false, ...rest }: InputNumberPropsC) => {
    const handleValue = (value: string) => {
        if (decimals) {
            const replace = value.replace(/[^\d.]/g, "")
            const split = replace.split(".")
            if (split.length > 1) {
                const [first, ...rest] = split
                const clear =
                    split.length >= 2
                        ? `${first}.${`${rest.toString().replaceAll(",", "")}`.replace(",", "")}`
                        : split.length > 1
                        ? `${first}.${split?.[1]}`
                        : replace
                onChange(clear)
            } else {
                onChange(replace)
            }
        } else {
            onChange(value.replace(/[^\d]/g, ""))
        }
    }
    return <InputText value={value} onChange={(e) => handleValue(e.target.value)} {...rest} />
}
