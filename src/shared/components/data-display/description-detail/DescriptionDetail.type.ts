import { CSSProperties } from "react"
import { COLLECTION } from "src/shared/icons/Icon"
import { ComponentProps } from "src/types/component"

export interface Props extends ComponentProps {
    label: string
    iconStyle?: CSSProperties
    value: string | string[]
    date?: string
    darkMode?: boolean
    link?: string
    icon?: keyof typeof COLLECTION | (string & {})
    amount?: number
    linkBottom?: boolean
    onLink?: () => void
    dateBottom?: boolean
    dateBottomText?: string
}
