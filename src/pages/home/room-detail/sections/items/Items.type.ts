import { ComponentProps } from "src/types/component"
import { Props as DescriptionProps } from "src/shared/components/data-display/description-detail/DescriptionDetail.type"
import { CSSProperties } from "react"

export interface CommentProps extends ComponentProps {
    value: string
    onChange: (value: string) => void
}

export interface ItemPaymentProps extends Omit<DescriptionProps, "date" | "link" | "onLink"> {
    payments?: string[]
    withPrinter?: boolean
    onPrint?: () => void
    printBottom?: boolean
    paymentsLovePoint?: boolean
    dateBottomText?: string
}

export interface ItemMultiplePaymentProps extends ComponentProps {
    icon: string
    label: string
    showAmounts?: boolean
    editable?:boolean
    link?: string
    onLink?: () => void
    payments: {
        label: string
        amount?: number
        date?: string
    }[]
    labelClass?: string
    dateBottomText?: string
}

export interface ItemTimerProps extends Omit<DescriptionProps, "value"> {
    dateTimer: string
    itemsContainerStyle?: CSSProperties
}
