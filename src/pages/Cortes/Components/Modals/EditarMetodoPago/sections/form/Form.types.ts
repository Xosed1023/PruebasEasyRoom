export interface BaseProps {
    total: number
    tipo: string
}

export interface ComponentProps extends BaseProps {
    subtotal: number
    data: Metodo[]
    is_mixto: boolean
}

export interface FormProps extends ComponentProps {
    className: string
    onClose: () => void
    onSubmit: () => void
    onAddMetodo: () => void
}

export type Metodo = {
    metodo_id: string
    subtotal: number
    tipo_pago: string
    numero_referencia: string
    monto_propina: number
}

export type FormValues = {
    metodo_pago: Metodo[]
}

export interface MetodoProps extends ComponentProps {
    onRemove: () => void
    index: number
    metodo_origen: Metodo
}
