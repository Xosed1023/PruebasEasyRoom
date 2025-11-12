import { ButtonHTMLAttributes, CSSProperties } from "react"
import { IconProps } from "src/shared/icons/interfaces/IconProps.interface"
import { IconNameType } from "src/shared/types/IconNameType"

export interface ButtonIconProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "ref"> {
    iconName: IconNameType;
    theme?: "primary" | "secondary"
    iconProps?: IconProps,
    width?: CSSProperties["width"]
}
