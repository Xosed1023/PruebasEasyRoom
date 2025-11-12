import { Control } from "react-hook-form"

export type FormValues = {
    name: string
    phoneNumber: string
    email?: string
    payment: string
    method: string
    advance: number
    // services: string[]
    comment: string
    cardNumber: string
    abonarEasyRewards: string
    extra: {
        amount: number
        type: string
        number: string
    }[]
    costs: {
        room: number
        users: number
        total: number
        experiencias: number
        general: number
        payment: number
    }
    transferNumber: string
}

// export type FormItemProps = {
//     serviceList?: { label: string; value: string }[]
//     control: Control<FormValues, any>
// }

export type PaymentSelectProps = {
    control: Control<FormValues, any>
    state: ModalStatus
    onClick: (value: ModalStatus) => void
}

// export type ServicesProps = {
//     value: string[]
//     serviceList: { label: string; value: string }[]
//     onChange: (value: string[]) => void
// }

export type ModalControl = {
    onClose?: () => void
    onOpen: () => void
}

export type ModalStatus = {
    visible: boolean
    edited: boolean
}

export interface ModalProps {
    title: string
    description?: string
}
export interface PaymentModalProps {
    visible: boolean
    onClose: () => void
}

