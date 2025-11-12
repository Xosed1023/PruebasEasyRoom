export interface HabitacionesItems {
    dashboard: Dashboard;
    respuesta: Respuesta;
}

export interface Dashboard {
    a_la_venta:    number;
    bloqueada:     number;
    mantenimiento: number;
    ocupada:       number;
}

export interface Respuesta {
    pagina_actual:          number;
    tabla_ventas_articulos: TablaVentasArticulo[];
    total_paginas:          number;
    total_registros:        number;
}

export interface TablaVentasArticulo {
    comentario_status:  string;
    estatus_habitacion: string;
    fecha:              string;
    habitacion:         string;
    tipo_habitacion:    string;
    usuario_actualiza:  string;
}
