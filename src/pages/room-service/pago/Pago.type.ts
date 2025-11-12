import { PropinaItem } from "src/shared/sections/payment/types/propinas"
import { LovePoint } from "src/pages/easyrewards/components/InputAbonarEasyRewards/InputAbonarEasyRewards.types"

export type FormValues = {
    paymentType: string
    paymentMethod: string
    extra: {
        amount: number
        type: string
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

export type SectionProps = {
    items: {
        label: string
        value: number
    }[]
    pagoParcial?: {
        pago: number
        id: string
    }
}

export type ModalStatus = {
    visible: boolean
    edited: boolean
}

export type PaymentMethodProps = {
    state: ModalStatus
    onClick: (value: ModalStatus) => void
}

export type PaymentMethodLovePointProps = {
    state: ModalStatus
    onClick: (value: ModalStatus) => void
    setLovePointsAmount: React.Dispatch<React.SetStateAction<LovePoint | null>>
    lovePointsAmount: LovePoint | null
}

export interface Tabs {
    label: string
    path: string
    number: number
}

export type TabsPago = "Estancia" | "RoomService"
