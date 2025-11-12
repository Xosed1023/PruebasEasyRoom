import { CSSProperties } from "react"

export interface ItemProps {
    className?: string
    style?: CSSProperties
    drawer?: boolean
}

export interface Props {
    className?: string
    style?: CSSProperties
    elements?: number
    drawer?: boolean
}
