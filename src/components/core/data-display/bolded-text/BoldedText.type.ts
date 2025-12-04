import { CSSProperties } from "react"

export interface BoldedTextProps {
    className?: string
    style?: CSSProperties
    children: string
    boldClassName?: string
    color?: string
    boldColor?: string
}
