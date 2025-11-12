import { InputHTMLAttributes } from "react"

export interface InputRadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
    title?: string
    subtitle?: string
}
