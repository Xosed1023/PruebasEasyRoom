export interface PropinasItems {
    dashboard: Dashboard;
    respuesta: Respuesta;
}

export interface Dashboard {
    contador_propinas_pagadas:  number;
    promedio_propinas_pagadas:  string;
    total_comisiones_bancarias: string;
    total_propinas_pagadas:     string;
    total_propinas_recibidas:   string;
    total_puntios_a_pagar:      string;
    total_utilidad_por_puntos:  string;
}

export interface Respuesta {
    pagina_actual:          number;
    tabla_propinas_pagadas: TablaPropinasPagada[];
    total_paginas:          number;
    total_registros:        number;
}

export interface TablaPropinasPagada {
    area:                string;
    colaborador:         string;
    comision_bancaria:   string;
    fecha_registro:      string;
    pago_a_colaborador:  string;
    propina_recibida:    string;
    puesto:              string;
    puntos_a_pagar:      string;
    utilidad_por_puntos: string;
}
