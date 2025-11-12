import { ReactNode } from "react"
import { ComponentProps } from "src/types/component"

export interface Props extends ComponentProps {
    title?: string
    subtitle?: string
    contentClassName?: string
    back?: boolean
    close?: boolean
    staticWidth?: boolean
    onClose?: () => void
    onBack?: () => void
    children: ReactNode | ReactNode[]
    headerRight?: ReactNode
    headerLeft?: ReactNode
}
