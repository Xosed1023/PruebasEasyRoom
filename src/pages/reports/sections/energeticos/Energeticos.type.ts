export interface EnergeticosItems {
    dashboard: Dashboard;
    respuesta: Respuesta;
}

export interface Dashboard {
    consumo_agua:           number;
    consumo_gas:            number;
    consumo_luz:            number;
    hab_bloqueadas:         number;
    incidencias_cerradas:   number;
    incidencias_pendientes: number;
}

export interface Respuesta {
    pagina_actual:   number;
    tabla_mantto:    TablaMantto[];
    total_paginas:   number;
    total_registros: number;
}

export interface TablaMantto {
    agua:             number;
    area:             string;
    colaborador_id:   string;
    fecha_registro:   string;
    gas:              number;
    luz:              number;
    mantenimiento_id: string;
    no_corte:         number;
    puesto:           string;
    reponsable:       string;
    turno:            string;
}
