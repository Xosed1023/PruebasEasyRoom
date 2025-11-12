import { EstadoPagoOrdenes, EstadosOrdenHistorial, OrdenesQuery, Usuario } from "src/gql/schema"

export interface OrderDetails {
    orden?: OrdenesQuery["ordenes"][0]
    estado?: EstadosOrdenHistorial.Cancelada | EstadoPagoOrdenes.Pagada | EstadoPagoOrdenes.NoPagada | EstadoPagoOrdenes.Deposito | EstadoPagoOrdenes.PagoParcial
    productos?: ProductosDetails[]
    usuario?: Usuario
    total?: string
    impuesto?: string
    pagos?: DetallePagoDetails[]
}

export interface ProductosDetails {
    fechaDevolucion?: string
    aplicaReembolso?: boolean
    motivoDevolucion?: string
    label?: string
    value2?: number
    icon?: string
    value?: string
    cantidad?: number
    comentarios: string
}

export interface DetallePagoDetails {
    label: string
    value2: string
    icon: string
}

export interface OrderDetailsWithColaborador extends OrderDetails {
    orden?: OrdenesQuery["ordenes"][0] & {
        colaborador_consumo_interno?: {
            nombre: string
            apellido_paterno: string
        }
        corte_id?: string
    }
}