import { DetalleOrden, EstadosOrdenHistorial, Orden } from "src/gql/schema"

export interface RecetaProps {
    receta: DetalleOrden
    codigoOrden: string
    button: boolean
    orderState: EstadosOrdenHistorial
    currentState: EstadosOrdenHistorial
    comandaId: string
    orderComandaChangeState?: "editada" | "eliminada" | null
}

export interface CategoryProps {
    category: string
    recetas: DetalleOrden[]
    codigoOrden: string
    firstCategory: boolean
    ordenLength: number
    orderState: EstadosOrdenHistorial
    currentState: EstadosOrdenHistorial
    comandaId: string
    orderComandaChangeState?: "editada" | "eliminada" | null
}

export interface OrdenRecetaContainerProps {
    state: EstadosOrdenHistorial
    orderComandaChangeState?: "editada" | "eliminada" | null
    order: Orden
    filter: string[]
    currentState: EstadosOrdenHistorial
}
