import { CSSProperties } from "react"

export type ComponentProps = {
    className?: string
    style?: CSSProperties
}

export type StatusProps = {
    error?: boolean
    disabled?: boolean
}

export type ToggleProps = {
    visible: boolean
    onClose: () => void
}
