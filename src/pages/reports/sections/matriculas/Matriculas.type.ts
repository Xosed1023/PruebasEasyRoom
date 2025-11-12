export interface Mantenimientos {
    dashboard: Dashboard;
    respuesta: Respuesta;
}

export interface Dashboard {
    total_manttos:          number;
    total_manttos_abiertos: number;
    total_manttos_cerrados: number;
}

export interface Respuesta {
    pagina_actual:        number;
    registros_por_pagina: number;
    tabla_manttos:        TablaMantto[];
    total_paginas:        number;
    total_registros:      number;
}

export interface TablaMantto {
    comentarios:       string;
    estatus:           string;
    fecha_inicio:      string;
    fecha_termino:     string;
    numero_habitacion: string;
    puesto:            string;
    responsable:       string;
    tiempo_total:      string;
    tipo_habitacion:   string;
    tipo_mantto:       string;
    turno:             string;
}
