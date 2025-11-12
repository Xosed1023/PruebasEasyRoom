export interface ProductividadCamaristas {
    dashboard: Dashboard;
    respuesta: Respuesta;
}

export interface Dashboard {
    limpiezas_detalladas: number;
    limpiezas_normales:   number;
    limpiezas_retoque:    number;
    promedio_limpieza:    number;
    promedio_supervision: number;
    total_limpiezas:      number;
    total_supervisiones:  number;
}

export interface Respuesta {
    pagina_actual:   number;
    tabla_limpiezas: TablaLimpieza[];
    total_paginas:   number;
    total_registros: number;
}

export interface TablaLimpieza {
    "Inicio supervision": string;
    camarista:            string;
    fin_limpieza:         string;
    fin_supervision:      string;
    habitacion:           string;
    inicio_limpieza:      string;
    observaciones:        null;
    supervisor:           string;
    tipo_habitacion:      string;
    tipo_limpieza:        string;
    turno:                string;
}

