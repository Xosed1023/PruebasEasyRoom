import { CSSProperties } from "react"
import { Option } from "src/shared/components/forms/selelct-dropdown/Dropdown";
import { PropinaItem } from "src/shared/sections/payment/types/propinas";
import { ToggleProps } from "src/types/component"


export interface ModalPagoMixtoLovePointsProps extends ToggleProps {
    edited?: boolean
    buttonText?: string, 
    withPendingPayment?: boolean
    paymentOptions: Option[]
    modalBodyStyle?: CSSProperties
    onBack?: () => void
    isAlreadyInModal?: boolean
    withCancelButton?: boolean
    className?: string
    validateTotal?: boolean
    lovePointsAmount?: { id: string; saldo: number } | null;
    paymentType?: string; 
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
