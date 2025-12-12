import { ReactElement } from "react"

export type Props = {
    className?: string
    containerClassName?: string
    children: ReactElement
    items: {
        label: string
        onClick: () => void
        disabled?: boolean
    }[]
    config?: {
        top: number
        left: number
    }
}
