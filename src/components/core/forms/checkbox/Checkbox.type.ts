import { CSSProperties } from "react"

export interface Props {
    label?: string
    description?: string
    altDescription?: string
    value: boolean
    onChange?: (value: boolean) => void
    onClick?: () => void
    error?: boolean
    className?: string
    disabled?: boolean
    style?: CSSProperties
}
