export type FormValues = {
    foto: File | string
    venta: boolean
    nombre: string
    marca: string
    sku: string
    unidad: string
    contenido: string
    categoria_id: string
    costo: number
    precio: number
    cantidad_inventario: string
    alerta_inventario: string
    activo: boolean
    almacen_id: string
}

export interface FormValuesParam extends FormValues {
    categoria: string
}

export type FormProductoProps = {
    type: "add" | "edit"
    defaultValues: FormValues
    onChange: (value: FormValuesParam) => void
}
