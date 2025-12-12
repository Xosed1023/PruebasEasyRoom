import { InputHTMLAttributes } from "react"
import { OptionTel } from "./option-tel.interface"

export interface InputTelProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "onChange"> {
    label?: string
    hinttext?: string
    errorhinttext?: string
    error?: boolean
    tooltip?: string
    onPrefixChange: (value: OptionTel) => void
    onInputChange: (e: string) => void
    prefixValue?: string
    telValue?: string
    width?: number
}
