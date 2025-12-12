export interface Huespedes {
    dashboard: Dashboard;
    respuesta: Respuesta;
}

export interface Dashboard {
    cantida_rentas:    number;
    cantidad_extras:   number;
    cantidad_reservas: number;
    cantidad_rest:     number;
    cantidad_rs:       number;
    total_reg:         number;
    venta_extras:      number;
    venta_rentas:      number;
    venta_reservas:    number;
    venta_rest:        number;
    venta_rs:          number;
}

export interface Respuesta {
    pagina_actual:          number;
    registros_por_pagina:   number;
    tabla_ventas_articulos: TablaVentasArticulo[];
    total_paginas:          number;
    total_registros:        number;
}

export interface TablaVentasArticulo {
    cliente_id:           string;
    color_vehiculo:       string;
    consumo_extras:       number;
    consumo_renta:        number;
    consumo_reserva:      number;
    consumo_restaurante:  number;
    consumo_room_service: number;
    correo_cliente:       string;
    easyrewards:          string;
    huesped:              string;
    marca_vehiculo:       string;
    matricula_vehiculo:   string;
    modelo_vehiculo:      string;
    telefono_cliente:     string;
    tipo_entrada:         string;
}
