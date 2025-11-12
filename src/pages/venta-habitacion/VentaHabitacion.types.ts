import { ReactNode } from "react"
import { Reserva } from "src/gql/schema"
import { ComponentProps } from "src/types/component"

export interface BlockProps extends ComponentProps {
    title: string
    children: ReactNode | ReactNode[]
    extraInputs?: {
        label: string
        name: string
        amount: number | null
        required?: boolean
        errorRequiredText?: string
        max?: number
    }[]
    extraName?: string
}

export interface InputTabsProps {
    label: string
    value: string
    items: {
        label: string
        value: string
        icon: string
    }[]
    onChange: (value: string) => void
}

export type HiddeFieldProps = {
    extraUsersCost: number
    extraHoursCost: number
    reservaSeleccionada: Reserva
}

export type FormValues = {
    type: string
    date: string | Date[]
    amount: string
    extraHours: number
    name: string
    entryType: string
    carId: string
    extraUsers: number
    users: number
    method: string
    extra: {
        amount: number
        type: string
        number: string
    }[]
    costs: {
        room: number
        users: number
        hours: number
        tax: number
        total: number
        general: number
    }
}

export type ModalStatus = {
    visible: boolean
    edited: boolean
}
