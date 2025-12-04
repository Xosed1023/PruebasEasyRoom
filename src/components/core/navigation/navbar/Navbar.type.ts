import { CSSProperties } from "react"

type Item = {
    label: string
    icon: string
    value: string
    path: string
    activeIcon?: string
}

export type NavbarProps = {
    value: string
    onChange: (value: string) => void
    className?: string
    style?: CSSProperties
    items: Item[]
}
