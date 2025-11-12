import { TiposPagos } from "src/gql/schema";
import { PropinaItem } from "src/shared/sections/payment/types/propinas";

export interface CerrarCuentaContentProps {
    loader: (value: boolean) => void
}

export type FormValues = {
    paymentType: string
    paymentMethod: string
    extra: {
        amount: number
        type: TiposPagos
        number?: string
        easyrewards_id?: string | undefined
    }[]
    extraAbonar?: {
        number: string
    }[] 
    propinas: PropinaItem[]
    colaborador_id: string
    costs: {
        total: number
        general: number
        payment: number
    }
}