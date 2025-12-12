export interface MatriculasData {
    respuesta: Respuesta;
}

export interface Respuesta {
    pagina_actual:          number;
    registros_por_pagina:   number;
    tabla_placas_vehiculos: TablaPlacasVehiculo[];
    total_paginas:          number;
    total_registros:        number;
}

export interface TablaPlacasVehiculo {
    color:                 Color;
    concepto:              Color;
    fecha_entrada:         string;
    historial_vehiculo_id: string;
    marca:                 Marca;
    matricula:             string;
    modelo:                Modelo;
    turno:                 Turno;
    vehiculo_id:           string;
    motivo_ingreso_id:     string | null;
    nombre_motivo:         string;
    renta_id:              string | null;
}

export enum Color {
    Blanco = "Blanco",
    Empty = "-",
    Gris = "Gris",
}

export enum Marca {
    Bmw = "BMW",
    Empty = "-",
    Kia = "Kia",
}

export enum Modelo {
    Empty = "-",
    Sorento = "SORENTO",
    X6 = "X 6",
}

export enum Turno {
    Matutino = "Matutino",
}
