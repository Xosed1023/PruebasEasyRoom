export interface addCategoriaProps {
    visible: boolean
    onClose: () => void
    values?: FormValues
    type?: string
    active: boolean
    idAlmacen: string
}

export type FormValues = {
    nombre: string
    hotel_id: string
    descripcion: string
    categoria_id?: string[]
    total?: number
}
