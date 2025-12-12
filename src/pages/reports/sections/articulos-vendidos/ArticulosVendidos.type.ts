export interface HistorialVentasArticulos {
    dashboard: Dashboard;
    respuesta: Respuesta;
}

export interface Dashboard {
    cantidad_articulos: number;
    contador_sku:       number;
    ticket_promedio:    number;
    total_ventas:       number;
}

export interface Respuesta {
    pagina_actual:          number;
    tabla_ventas_articulos: TablaVentasArticulo[];
    total_paginas:          number;
    total_registros:        number;
}

export interface TablaVentasArticulo {
    Articulo:   string;
    Cantidad:   number;
    Categoria:  string;
    Fecha:      string;
    Origen:     string;
    Precio:     string;
    Referencia: string;
    Ticket:     number;
    Total:      string;
    Turno:      string;
}
