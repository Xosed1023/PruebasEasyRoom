export interface ResumenPagos {
    cantidad_fajillas:     number;
    efectivo_menos_gastos: number;
    gastos:                Gastos;
    habitaciones:          Habitaciones;
    reservas:              Reservas;
    room_service:          Habitaciones;
    total_efectivo:        number;
    total_fajillas:        number;
    total_gastos:          number;
}

export interface Gastos {
    total: number;
}

export interface Habitaciones {
    amex:            number;
    consumo_interno: number;
    cortesia:        number;
    deposito:        number;
    efectivo:        number;
    total:           number;
    visa_master:     number;
}

export interface Reservas {
    amex:        number;
    deposito:    number;
    efectivo:    number;
    total:       number;
    visa_master: number;
}