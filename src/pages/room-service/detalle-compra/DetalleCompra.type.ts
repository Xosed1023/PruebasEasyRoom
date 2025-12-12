import { PropinaItem } from "src/shared/sections/payment/types/propinas"
import { CategoryItem, Product, ProductItem } from "../productos/Products.type"
import { LovePoint } from "src/pages/easyrewards/components/InputAbonarEasyRewards/InputAbonarEasyRewards.types"
import { TiposPagos } from "src/gql/schema"

export type InputNumberProps = {
    value: string
    onChange: (value: string) => void
    error: boolean
    testId?: string
}

export type FormValues = {
    type: string
    renta: string
    products: Product[]
    categoryList: CategoryItem[]
    paymentType: string
    paymentMethod: string
    extra: {
        amount: number
        type: TiposPagos
        number?: string
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
    consumo_interno_colaborador_id: string
}

export type TicketItemProps = {
    category: string
    number: number
    cost: number
    icon?: string
    extras: ProductItem[]
}

export type ModalStatus = {
    visible: boolean
    edited: boolean
}

export type ModalConfirm = {
    visible: boolean
    orden: string
    tipo: string
}

export type PaymentMethodProps = {
    state: ModalStatus
    onClick: (value: ModalStatus) => void
    setLovePointsAmount: React.Dispatch<React.SetStateAction<LovePoint | null>>
    lovePointsAmount: LovePoint | null
}

export interface DetalleCompraContentProps {
    editMode?: boolean
    setLovePointsAmount: React.Dispatch<React.SetStateAction<LovePoint | null>>
    lovePointsAmount: LovePoint | null
    loader: () => void
}
