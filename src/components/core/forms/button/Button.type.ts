import { ButtonHTMLAttributes } from "react"

export type Theme =
    | "primary"
    | "primary-resumen"
    | "secondary"
    | "secondary-gray"
    | "tertiary"
    | "tertiary-gray"
    | "custom"

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "ref"> {
    text?: string
    icon?: string
    theme?: Theme
    loading?: boolean 
}
