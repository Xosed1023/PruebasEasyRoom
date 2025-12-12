export interface HistorialIncidencias {
    dashboard: Dashboard;
    respuesta: Respuesta;
}

export interface Dashboard {
    total_incidencias:       number;
    total_limpieza:          number;
    total_mantto:            number;
    total_objetos_olvidados: number;
    urgencia_alta:           number;
    urgencia_baja:           number;
    urgencia_media:          number;
}

export interface Respuesta {
    pagina_actual:          number;
    tabla_ventas_articulos: TablaVentasArticulo[];
    total_paginas:          number;
    total_registros:        number;
}

export interface TablaVentasArticulo {
    cierra:            string;
    comentario_cierre: null | string;
    descripcion:       string;
    estado_incidencia: string;
    fecha_cierre:      string;
    fecha_registro:    string;
    folio_incidencia:  number;
    lugar_responsable: string;
    matricula:         null | string;
    numero_habitacion: string;
    reporta:           string;
    tipo_incidencia:   string;
    urgencia:          string;
}
