import { ComponentType, InputHTMLAttributes, Ref } from "react"
import { IconProps } from "src/shared/icons/interfaces/IconProps.interface"

export interface ToolTip {
    title: string
    description?: string
    theme?: "light" | "dark"
    placement?: "top" | "left" | "right" | "bottom"
}
export interface InputTextProps extends InputHTMLAttributes<HTMLInputElement> {
    ref?: Ref<HTMLInputElement>
    label?: string
    hinttext?: string
    errorhinttext?: string
    error?: boolean
    triggerOnChangeOnBlur?: boolean
    tooltipInput?: ToolTip
    tooltipLabel?: ToolTip
    icon?: ComponentType<any>
    iconProps?: IconProps
    inputWrapperClass?: string
    type: "text" | "password" | "number"
    toolTipInfo?: boolean
    loader?: boolean
    iconPadding? : string
    description?: string
}
