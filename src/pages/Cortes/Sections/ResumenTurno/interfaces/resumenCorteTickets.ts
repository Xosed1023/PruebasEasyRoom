export interface ResumenCorteTickets {
    cancelaciones: Cancelaciones
    estancia: ResumenCorteTicketsEstancia
    gastos_corte: GastosCorte
    incidencias_corte: IncidenciaCorte[]
    propinas_corte: GastosCorte
    reservas: Reservas
    room_service: GastosCorte
    restaurante: GastosCorte
    anticipos_validos: AnticiposValidos
}

export interface Cancelaciones {
    estancia: EstanciaElement
    roomservice: Roomservice
    totales: CancelacionesTotales
}
export interface EstanciaElement {
    cantidad: number
    total: string
}

export interface Roomservice {
    cantidad: string
    total: string
}

export interface CancelacionesTotales {
    cantidad_total: string
    monto_total: string
}

export interface ResumenCorteTicketsEstancia {
    early_checkin: EarlyCheckin[]
    extras: Extra[]
    habitaciones: Habitaciones[]
    totales: CancelacionesTotales
}

export interface EarlyCheckin {
    cantidad: number
    concepto: string
    precio_promedio: string
    total: string
}

export interface Extra {
    cantidad: number | string
    concepto: string
    precio_promedio: number | string
    total: number | string
}

export interface Habitaciones {
    cantidad: number
    concepto: string
    precio_promedio: number | string
    total: number | string
}

export interface GastosCorte {
    desgloce: Desgloce[]
    totales: GastosCorteTotales
}

export interface Desgloce {
    cantidad: number
    concepto: string
    total: number
    precio_promedio?: number
}

export interface GastosCorteTotales {
    cantidad_total: number
    monto_total: number
}

export interface Reservas {
    anticipos_reserva: Desgloce[]
    saldos_reservas: Desgloce[]
    totales: GastosCorteTotales
}

export interface IncidenciaCorte {
    area: string
    detalle: string
    estado: string
    folio: number
    numero_habitacion: string
    severidad: string
}
export interface AnticiposValidos {
    anticipos_validos_extras: Extra[]
    anticipos_validos_habitaciones: Habitaciones[]
    totales: CancelacionesTotales
}
