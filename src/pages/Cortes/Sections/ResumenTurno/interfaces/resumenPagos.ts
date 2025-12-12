export interface ResumenPagos {
    dashboard:                     Dashboard;
    efectivo_disponible_recepcion: number;
    efectivo_menos_gastos:         number;
    fajillas:                      Fajillas;
    gastos:                        number;
    habitaciones:                  Habitaciones;
    propinas:                      Propinas;
    reservas:                      Reservas;
    room_service:                  Habitaciones;
    restaurante:                   Habitaciones;
    total_efectivo:                number;
    total_gastos:                  number;
}

export interface Dashboard {
    amex:               number;
    cantidad_fajillas:  number;
    depositos_transfer: number;
    efectivo_caja:      number;
    gastos:             number;
    total_fajillas:     number;
    total_ventas:       number;
    visa_mastercard:    number;
}

export interface Fajillas {
    cantidad_fajillas: number;
    desgloce:          Desgloce[];
    total_fajillas:    number;
}

export interface Desgloce {
    cantidad: number;
    estatus:  string;
    monto:    number;
    total:    number;
}

export interface Habitaciones {
    amex:            number;
    consumo_interno: number;
    cortesia:        number;
    deposito:        number;
    efectivo:        number;
    total:           number;
    visa_master:     number;
    easy_rewards:    number;
}

export interface Propinas {
    propinas_amex:           number;
    propinas_efectivo:       number;
    propinas_visaMastercard: number;
    total_propinas: number
}

export interface Reservas {
    amex:        number;
    deposito:    number;
    efectivo:    number;
    total:       number;
    visa_master: number;
}