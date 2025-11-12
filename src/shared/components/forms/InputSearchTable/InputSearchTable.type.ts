import { FocusEventHandler, MouseEventHandler } from "react"
import { AlmacenArticulo, Articulo, CategoriaArticulo, EstadosAlmacenesArticulos } from "src/gql/schema"
import { ComponentProps } from "src/types/component"

export interface Props extends ComponentProps {
    onChange: (value: AlmacenArticulo) => void
    onChangeText?: (value: string) => void
    onClear: (searched: boolean) => void
    onInputClick?: MouseEventHandler<HTMLInputElement> | undefined
    onBlur?: FocusEventHandler<HTMLInputElement> | undefined
    almacen?: boolean
    categoryDescription?: boolean
    placeholder?: string
    descriptionText?: boolean
    value?: string
    extraInfo?: boolean
    articulosList?: AlmacenArticulo[]
}

export type State = {
    label: string
    value: string
}

export type Value = {
    name: string
    categoryId: string
    productId: string
}

export interface AlmacenArticuloPlain {
    costo: number
    almacen_articulo_id: string
    almacen_id: string
    articulo_id: string
    precio: number
    cantidad: number
    almacen: string
    articulo: Articulo
    cantidad_minima: number
    categoria_id: string
    contenido: number
    descripcion: string
    tipo: string
    extra: boolean
    foto: string
    marca: string
    nombre: string
    unidad: string
    sku: string
    estado: EstadosAlmacenesArticulos
    categoria_articulo?: CategoriaArticulo | null
}
