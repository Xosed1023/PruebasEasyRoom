import { CSSProperties } from "react"
import { TiposPagos } from "src/gql/schema"
import { ToggleProps } from "src/types/component"
import { PropinaItem } from "../types/propinas"

export interface ModalMixtoProps extends ToggleProps {
    edited?: boolean
    onLovePointsChange?: (value: { id: string; saldo: number }) => void;
    withPendingPayment?: boolean
    paymentOptions: {
        label: string
        value: TiposPagos
    }[],
    modalBodyStyle?: CSSProperties
    onBack?: () => void
    isAlreadyInModal?: boolean
    withCancelButton?: boolean
    className?: string
    validateTotal?: boolean
}

export type ExtForm = {
    extra: {
        amount: number
        type: string
        number: string
    }[]
    costs: {
        total: number
        general: number
    }
    propinas: PropinaItem[]
}
