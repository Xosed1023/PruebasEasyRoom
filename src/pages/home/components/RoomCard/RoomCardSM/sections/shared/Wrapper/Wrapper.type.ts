import { ReactNode } from "react"

export interface WrapperProps {
    children: ReactNode
    bgColor?: string
    alertBgColor1?: string | null
    alertBgColor2?: string | null
    onSelect?: () => void
    className?: string
    style?: React.CSSProperties
}