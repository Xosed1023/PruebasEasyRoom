import { ComponentProps } from "src/types/component"

export type RoomServiceProps = {
    fullscreen?: boolean
    editMode?: boolean
    restaurantMode?: boolean
    showReset?: boolean
    defaultProducts?: Product[]
    title?: string
    uniqueProduct?: boolean
    onConfirm?: (value: Product[]) => void
    onPreventReduce?: (value: string) => void
    onChange?: (value: Product[]) => void
}

export interface LinkProps extends ComponentProps {
    children: string
    icon?: string
    onClick?: () => void
}

export interface TicketItemProps {
    name: string
    cost: number
    number: number
    comment: string
    price: number
    type: string
    extra?: boolean
    extras: ProductItem[]
    onRemove: () => void
    onChange: (value: string) => void
    onClickExtra: () => void
    onCloseModal: () => void
}

export type ProductItem = {
    id: string
    name: string
    cost: number
    price: number
    number: number
    comment?: string
    categoryId: string
    category: string
    selection_id?: string
}

export interface Product extends ProductItem {
    type: string
    extra?: boolean
    extras: ProductItem[]
    unique?: boolean
}

export type Category = {
    categoria_id: string
    nombre: string
}

export interface CategoryItem extends Category {
    products: Product[]
    total: number
    totalIva: number
}

export type SubTotalProps = {
    categories: CategoryItem[]
}

export type TotalProps = {
    total: number
}
