import { ReactNode } from "react"

export type ScreenDetailProps = {
    children: ReactNode
    className?: string
    title: string
    onBack?: () => void
}
