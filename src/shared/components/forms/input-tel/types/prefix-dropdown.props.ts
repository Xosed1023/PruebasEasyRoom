import { CSSProperties, HTMLAttributes } from "react"
import { OptionTel } from "./option-tel.interface"

export interface PrefixDropdownProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
    className?: string
    options: OptionTel[]
    value: string
    label?: string
    onChange?: (value: OptionTel) => void
    placeholder?: string
    disabled?: boolean
    open: boolean,
    setOpen: (value: boolean) => void
    dropdownStyles?: CSSProperties
}

export interface PrefixDropdownRef {
    dropdownRef: React.RefObject<HTMLInputElement>,
    dropdownToggleRef: React.RefObject<HTMLInputElement>
}