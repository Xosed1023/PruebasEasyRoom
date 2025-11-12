export type Product = {
    id?: string
    numero: string
    devolucion?: string
    merma?: string
}
export type NumRefunds = {
    label: string
    value: number
}
export type TotalRefunds = {
    label: string
    value: string
}

export type FormValues = {
    reason: string
    detail: string
    order_id?: string
    products?: {
        articulo_id: string
        numero: number
        merma: boolean
        inventario: boolean
        reembolso: boolean
    }[]
}

export interface ModalProps {
    isOpen: boolean
    onCancel: () => void
    orderItems: any[]
}
