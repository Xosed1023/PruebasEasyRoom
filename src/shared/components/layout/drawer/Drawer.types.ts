import { CSSProperties, ReactNode } from "react"
import { ComponentProps } from "src/types/component"

export interface Props extends ComponentProps {
    visible: boolean
    children?: ReactNode | ReactNode[]
    bgStyle?: CSSProperties
    bgClassName?: string
    placement?: "top" | "right" | (string & {})
    bar?: boolean
    withCloseButton?: boolean
    withBackButton?: boolean
    withMenu?: boolean
    onClose?: () => void
    onBack?: () => void
    onClickMenu?: () => void
    ref?: React.RefObject<HTMLDivElement>
    itemsMenu?: {
        label: string
        onClick: () => void
        disabled?: boolean
    }[]
    config?: {
        top?: string
        left?: string
    }
}
