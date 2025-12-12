export interface HistorialVentasYReservas {
    dashboard: Dashboard;
    respuesta: Respuesta;
}

export interface Dashboard {
    cantidad_habitaciones:    number;
    cantidad_horas_extras:    number;
    cantidad_hospedaje_extra: number;
    cantidad_personas_extra:  number;
    cantidad_reservas:        number;
    venta_habitaciones:       number;
    venta_horas_extras:       number;
    venta_hospedaje_extra:    number;
    venta_personas_extra:     number;
    venta_reservas:           number;
}

export interface Respuesta {
    pagina_actual:         number;
    tabla_ventas_reservas: TablaVentasReserva[];
    total_paginas:         number;
    total_registros:       number;
}

export interface TablaVentasReserva {
    Cantidad:          number;
    fecha_registro:    string;
    hotel:             string;
    movimiento:        string;
    numero_habitacion: string;
    origen:            string;
    precio:            number;
    tipo_habitacion:   string;
}
