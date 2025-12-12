import { CSSProperties, ReactNode } from "react"
import { ComponentProps } from "src/types/component"

export interface ViewProps extends ComponentProps {
    children: ReactNode | ReactNode
    title?: string
    subtitle?: string
    folio?: number
    titleStyle?: CSSProperties
    subtitleStyle?: CSSProperties
}
