export interface GastosItems {
    dashboard: Dashboard;
    respuesta: Respuesta;
}

export interface Dashboard {
    administrativos_cantidad: number;
    administrativos_total:    number;
    financieros_cantidad:     number;
    financieros_total:        number;
    operativos_cantidad:      number;
    operativos_total:         number;
    otros_cantidad:           number;
    otros_total:              number;
    propinas_cantidad:        number;
    propinas_total:           number;
    total_gastos:             number;
}

export interface Respuesta {
    pagina_actual:   number;
    tabla_gastos:    TablaGasto[];
    total_paginas:   number;
    total_registros: number;
}

export interface TablaGasto {
    Categoria:      string;
    Descripcion:    string;
    Fecha_gasto:    string;
    Fecha_registro: string;
    Folio:          number;
    Responsable:    string;
    Subcategoria:   string;
    caja_chica:     string;
    categoria_id:   string;
    metodo_pago:    string;
    monto:          number;
}
