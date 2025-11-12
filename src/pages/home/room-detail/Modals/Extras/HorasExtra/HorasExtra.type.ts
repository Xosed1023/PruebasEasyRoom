import { TiposPagos } from "src/gql/schema"
import { PropinaItem } from "src/shared/sections/payment/types/propinas"

export type FormValues = {
    abonarEasyRewards: string
    colaborador_id: string
    extra: { amount: number; number: string; type: TiposPagos }[]
    propinas: PropinaItem[]
    costs: {
        total: number
        general: number
        payment: number
    }
    paymentMethod: string
    horasExtra: number
    cardNumber: string
}

export interface HorasExtraProps {
    isShowing: boolean
    onClose?: () => void
    endDate?: Date
    costoHoraExtra: number
    onConfirmed?: () => void
    horasExtraStart: number
    horasExtraMax: number
}