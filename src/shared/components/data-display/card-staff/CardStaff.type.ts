import { ComponentProps } from "src/types/component"
import { CardUserProps } from "../cart-user/CartUser"

export interface Props extends ComponentProps, Omit<CardUserProps, "size" | "textColor"> {
    text?: string
    active: boolean
    disabled?: boolean
    onClick?: () => void
}
