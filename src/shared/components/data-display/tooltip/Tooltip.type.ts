import { ReactNode } from "react"
import { ComponentProps } from "src/types/component"

export interface PropsToolTip extends ComponentProps {
    title: string
    description?: string
    children: ReactNode
    theme?: "light" | "dark"
    placement?: "top" | "left" | "right" | "bottom" | (string & {})
}

export interface ChildrenProps {
    onMouseEnter: () => void
    onMouseLeave: () => void
    ref: any
}
