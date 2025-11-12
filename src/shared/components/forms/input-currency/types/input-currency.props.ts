import { ChangeEvent, InputHTMLAttributes } from "react"
import { CurrencyInputProps } from "react-currency-input-field"
import { OptionCurrency } from "./option-currency.interface"

export interface InputTextProps extends Omit<InputHTMLAttributes<CurrencyInputProps>, "type" | "value" | "onChange"> {
    label?: string
    hinttext?: string
    errorhinttext?: string
    error?: boolean
    tooltip?: string
    onPrefixChange: (value: OptionCurrency) => void
    onInputChange: (e: ChangeEvent<HTMLInputElement>) => void
    prefixValue?: string
    amountValue?: string
}