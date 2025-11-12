import { ComponentProps } from "src/types/component"

export interface CardProps extends ComponentProps {
    containerClassName?: string
    title: string
    number: string
    title2?: string
    number2?: string
    percent?: string
    link?: string
    onLink?: () => void
    titleToolTip?: string
    toolTip?: string
    unidades?: string
    effectitrack?: string
}
