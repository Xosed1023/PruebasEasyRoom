import { ReactNode } from "react"
import { ComponentProps } from "src/types/component"

export interface Props extends ComponentProps {
    children: ReactNode
    title: string
    subtitle: string
    icon: string
    iconStyle?: any
}
