import { ReactNode } from "react"
import { ComponentProps } from "src/types/component"

export interface Props extends ComponentProps {
    title: string
    children: ReactNode | ReactNode[]
    btnLabel?: string
    withButton?: boolean
}

export type TicketContentProps = {
    clasName?: string
    children: ReactNode | ReactNode[]
}

export type TicketItemProps = {
    className?: string
    label: string
    value: string
    icon: string
}

export interface TicketItemDinamycProps extends Omit<TicketItemProps, "value"> {
    accessor: string
}

export interface TicketBlockProps extends ComponentProps {
    children: ReactNode | ReactNode[]
}

export interface TicketTotalProps extends ComponentProps {
    items: {
        label: string
        value?: number
        subtotal?: boolean
        total?: boolean
        negative?: boolean
        tax?: number
        visibleTax?: boolean
        className?: string
    }[]
    totalPagado?: number
}

export interface TicketItemPaymentsProps extends ComponentProps {
    methods: any[]
    propinas?: any[]
    mixto: boolean
    onClick: () => void
}
