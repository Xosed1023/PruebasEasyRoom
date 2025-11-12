import { ComponentProps, StatusProps } from "src/types/component"

export interface Props extends ComponentProps, Omit<StatusProps, "error"> {
    label?: string
    description?: string
    altDescription?: string
    value: boolean
    onChange?: (value: boolean) => void
    onClick?: () => void
    tooltip?: {
        title: string,
        description: string
    }
    iconColorWhenChecked?: string;
}
