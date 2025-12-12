import { TiposPagos } from "src/gql/schema"
import { PropinaItem } from "src/shared/sections/payment/types/propinas"

export type FormValues = {
    abonarEasyRewards: string
    colaborador_id: string | null
    extra: { amount: number; number: string; type: TiposPagos }[]
    propinas: PropinaItem[]
    costs: {
        total: number
        general: number
        payment: number
    }
    paymentMethod: string
    personaExtra: number
    cardNumber: string
}

export interface PersonasExtraProps {
    onClose: (data?: any) => void
}