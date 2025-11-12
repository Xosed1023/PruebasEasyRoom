import { COLLECTION } from "src/shared/icons/Icon"
import { ComponentProps } from "src/types/component"

export interface InputTabItem {
    bigLabel?: string,
    label: string
    value: string
    icon?: keyof typeof COLLECTION | (string & {})
    disabled?: boolean
}

export interface InputTabsProps extends ComponentProps {
    containerClassName?: string
    label: string
    value: string | string[]
    withCheckOnSelected?: boolean
    items: InputTabItem[]
    onChange: (value: string) => void
    disabled?: boolean
}
