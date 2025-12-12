export interface IMovimientosCorte {
    anticipos_reservas: any[];
    extras:             any[];
    gastos:             Gasto[];
    habitaciones:       Habitacione[];
    roomservice:        any[];
    saldos_reservas:    any[];
}

export interface Gasto {
    categoria:      string;
    concepto:       string;
    fecha_registro: Date;
    folio:          number;
    responsable:    string;
    tipo_pago:      string;
    total:          number;
}

export interface Habitacione {
    categoria:      string;
    concepto:       string;
    fecha_registro: Date;
    folio:          number;
    responsable:    string;
    ticket_id:      string;
    tipo_pago:      string;
    total:          string;
}