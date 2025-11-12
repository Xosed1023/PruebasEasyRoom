export interface InventariosType {
    dashboard: Dashboard;
    respuesta: Respuesta;
}

export interface Dashboard {
    cantidad_agotados:     number;
    cantidad_articulos:    number;
    cantidad_por_agotarse: number;
    costo_inventario:      number;
    valor_comercial:       number;
}

export interface Respuesta {
    pagina_actual:          number;
    tabla_ventas_articulos: TablaVentasArticulo[];
    total_paginas:          number;
    total_registros:        number;
}

export interface TablaVentasArticulo {
    almacen:             string;
    articulo:            string;
    cantidad_movimiento: number;
    costo_compra:        number;
    estado:              string;
    fecha_movimiento:    string;
    marca:               string;
    movimiento:          string;
    numero_articulo:     string;
    precio_venta:        number;
    tipo:                string;
    unidad:              string;
}
