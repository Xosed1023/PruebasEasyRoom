import { MouseEventHandler } from "react"
import { ComponentProps } from "src/types/component"

export interface Props extends ComponentProps {
    onChange: (value: Value, found: boolean) => void
    onChangeText?: (value: string) => void
    onClear: (searched: boolean) => void
    onInputClick?: MouseEventHandler<HTMLInputElement> | undefined
    almacen?: boolean
    categoryDescription?: boolean
    iconPadding?: string
    placeholder?: string
    descriptionText?: boolean
    value?: string
    extraInfo?: boolean
    data: any[]
    filterExtra?: boolean
    filterOnlyName?: boolean
}

export type State = {
    label: string
    value: string
}

export type Value = {
    name: string
    categoryId: string
    productId: string
}
