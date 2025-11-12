import { CSSProperties, ReactNode } from "react"
import { COLLECTION } from "src/shared/icons/Icon"
import { ComponentProps } from "src/types/component"

export interface Props extends ComponentProps {
    icon: keyof typeof COLLECTION | (string & {})
    title: string
    description?: string
    theme?: "dark" | "light"
    borderStyle?: CSSProperties
    iconStyle?: CSSProperties
    button?: ReactNode
}
