import { ComponentProps } from "src/types/component"

export interface ItemTabsProps extends ComponentProps {
    label: string
    timer: string
    active: boolean
    onClick?: () => void
}
export interface Item extends Omit<ItemTabsProps, "onClick" | "active" | "timer"> {
    value: string
    timer?: string
}

export interface RoomTabsProps extends ComponentProps {
    value: string
    items: Item[]
    onChange: (value: string) => void
}
