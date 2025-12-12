import { ComponentProps } from "src/types/component"

export interface CardProps extends ComponentProps {
    containerClassName?: string
    className?: string
    title?: string
    subtitle?: string
    total: number
    onEdit: () => void
    onDelete: () => void
    edit?: boolean
}
