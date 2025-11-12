import { Concepto } from "./concepto"

export interface MovimientosCorte {
    anticipos_reservas: Movimiento[]
    anticipos_reservas_cancelados: Movimiento[]
    extras: Movimiento[]
    extras_cancelados: Movimiento[]
    gastos: Movimiento[]
    gastos_cancelados: Movimiento[]
    habitaciones: Movimiento[]
    habitaciones_canceladas: Movimiento[]
    propinas: Propinas
    roomservice: Movimiento[]
    roomservice_cancelados: Movimiento[]
    saldos_reservas: Movimiento[]
    saldos_reservas_cancelados: Movimiento[]
}

export interface Propinas {
    estancia: Movimiento[]
    otros: Movimiento[]
    roomservice: Movimiento[]
}

export interface Movimiento {
    categoria: string
    concepto: Concepto
    fecha_registro: Date
    folio: number
    responsable: string
    ticket_id: string
    tipo_pago: string
    total: string
}
