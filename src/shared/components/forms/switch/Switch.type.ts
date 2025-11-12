import { MouseEvent } from "react"
import { ComponentProps, StatusProps } from "src/types/component"
import { PropsToolTip } from "../../data-display/tooltip/Tooltip.type"

export interface Props extends ComponentProps, Omit<StatusProps, "error"> {
    label?: string | JSX.Element
    description?: string
    value: boolean
    onChange?: (value: boolean) => void
    onClick?: (e: MouseEvent) => void
    error?: boolean
    tooltip?: Omit<PropsToolTip, "children">
    enabled?: boolean
}
