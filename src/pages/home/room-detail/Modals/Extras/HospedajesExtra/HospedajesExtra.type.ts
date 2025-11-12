import { TiposPagos, TiposAlojamientos } from "src/gql/schema"
import { PropinaItem } from "src/shared/sections/payment/types/propinas"

export type FormValues = {
    abonarEasyRewards: string
    extra: { amount: number; number: string; type: TiposPagos }[]
    colaborador_id: string
    propinas: PropinaItem[]
    costs: {
        total: number
        general: number
        payment: number
    }
    paymentMethod: string
    numPersonas: number
    nochesExtra: number
    cardNumber: string
}

export interface HospedajesExtraProps {
    tipoAlojamiento: TiposAlojamientos
    isShowing: boolean
    duracionEstancia: number
    onClose?: () => void
    endDate?: Date
    numPersonas: number
    numPersonasExtrasMax: number
    costoPersonaExtra: number
    costoHospedajeExtra: number
    onConfirmed?: () => void
}