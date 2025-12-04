import { IconNamesProps } from "@/icons"
import { InputHTMLAttributes } from "react"

type Props = InputHTMLAttributes<HTMLInputElement>

export interface InputTextProps extends Omit<Props, "value" | "onChange">  {
    error?: boolean
    label?: string
    hintText?: string
    errorHintText?: string
    value: string
    onChange: (value: string) => void | string
    icon?: IconNamesProps["name"]
    containerClassName?: string
}
