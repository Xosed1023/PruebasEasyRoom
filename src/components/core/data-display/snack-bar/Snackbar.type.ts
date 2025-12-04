import { CSSProperties, ReactNode } from "react"

export interface BaseProps {
    title?: string
    status: "success" | "error" | ""
    text?: string
    image?: string
    close?: boolean
}

export interface SnackbarProps extends BaseProps {
    className?: string
    style?: CSSProperties
    containerStyle?: CSSProperties
    children?: ReactNode
    isOpen?: boolean
    onClose?: () => void
    image?: string
    close?: boolean
}
