export interface IResumenCorte {
    anticipos_reserva: AnticiposReserva[];
    extras:            AnticiposReserva[];
    fajillas:          Fajilla[];
    gastos:            Gasto[];
    habitaciones:      Habitacione[];
    incidencias:       any[];
    roomservice:       Roomservice;
    saldos_reservas:   AnticiposReserva[];
}

export interface AnticiposReserva {
    cantidad:         number;
    concepto:         string;
    total:            number;
    precio_promedio?: number;
}

export interface Fajilla {
    cantidad: number;
    monto:    number;
    total:    number;
}

export interface Gasto {
    subcategoria: string;
    total:        number;
}

export interface Habitacione {
    cantidad:        number;
    concepto:        string;
    precio_promedio: number | string;
    total:           number | string;
}

export interface Roomservice {
    cantidad_total: number;
    monto_total:    number;
}