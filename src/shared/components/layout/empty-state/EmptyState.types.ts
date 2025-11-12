import { IconNamesProps } from "src/shared/icons/Icon"
import { ComponentProps } from "src/types/component"

export interface EmptyProps extends ComponentProps {
    containerClassName?: string
    title: string
    subtitle?: string
    icon?: IconNamesProps["name"]
    button?: string
    headerIcon?: IconNamesProps["name"]
    onClick?: () => void
}
