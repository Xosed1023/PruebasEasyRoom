import { CSSProperties, MouseEvent, ReactNode } from "react"
import { ButtonProps } from "src/shared/components/forms/button/types/button.props"
import { COLLECTION } from "src/shared/icons/Icon"
import { ComponentProps } from "src/types/component"

export interface Props extends ComponentProps {
    optionsClassName?: string
    title: any
    value: string
    buttonProps?: ButtonProps,
    options: {
        label: string
        icon: keyof typeof COLLECTION | (string & {})
        description?: string
        key: string
    }[]
    buttonStyle?: CSSProperties
    onChange: (string) => void
    onClick?: (e?: MouseEvent) => void
    withButton?: boolean
    children?: ReactNode | ReactNode[]
}
