import { ReactNode } from "react"
import { ComponentProps } from "src/types/component"

export interface BoxOptionMaskProps extends ComponentProps {
    active: boolean
    children?: ReactNode | ReactNode[]
    onClick?: () => void
}

export interface Props extends BoxOptionMaskProps {
    label?: string
    icon?: string
    labelClassName?: string
    iconClassName?: string
    iconWithCircle?: boolean
}
