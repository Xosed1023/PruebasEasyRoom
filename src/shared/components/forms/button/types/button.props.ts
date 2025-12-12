import { ButtonHTMLAttributes } from "react"
import { IconNameType } from "src/shared/types/IconNameType"

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "ref"> {
    text?: string
    icon?: IconNameType
    theme?: "primary" | "primary-resumen" | "secondary" | "secondary-gray" | "tertiary" | "tertiary-gray"
    textClass?: string
}
