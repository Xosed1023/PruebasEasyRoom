export type FormValues = {
    monto: number
    hotel: boolean
}

export type Params = {
    colaborador_id: string
    puesto_id: string
    ingreso_hotel: boolean
    monto_ajuste: number
}

export type ModalAjusteProps = {
    colaborador?: {
        colaborador_id: string
        puesto_id: string
        nombre: string
        puesto: string
        monto: number
        monto_ajuste: number
        ingreso_hotel: boolean
    }
    onClose: () => void
    onChange: (params: Params) => void
}
