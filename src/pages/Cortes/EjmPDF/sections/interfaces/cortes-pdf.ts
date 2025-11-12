export interface ICortes {
    cortes_pdf:                     CortesPDF;
    egresos:                        Egresos;
    informacion_anticipos_validos:  InformacionAnticiposValidos;
    resultado_corte:                ResultadoCorte;
    total_corte:                    TotalesPDF;
    manejo_efectivo?:               ManejoEfectivo;
    tickets_promedio?:              TicketsPromedio;
    resumen_propinas?:              ResumenPropinas[];
}

export interface CortesPDF {
    anticipos_reserva:          any;
    cancelaciones_conceptos:    any[];
    descuentos:                 Descuento[];
    early_checkin:              EarlyCheckin;
    efectivo_menos_gastos:      number;
    extras:                     EarlyCheckin[];
    fajillas:                   any[];
    folios_cortes:              FoliosCorte[];
    gastos:                     any[];
    habitaciones:               any[];
    incidencias:                any[];
    propinas_estancia?:         EarlyCheckin;
    propinas_restaurante?:      EarlyCheckin;
    propinas_roomservice?:      EarlyCheckin;
    restaurante:                Restaurante;
    roomservice:                Restaurante;
    saldos_reservas:            OSReserva[];
    propinas?:                  any;
    experiencias?:              any;
    suma_cantidades_ingresos?:  number;
    suma_totales_ingresos?:     number;
}

export interface OSReserva {
    cantidad: number;
    concepto: string;
    total:    number;
}

export interface Descuento {
    concepto:        string;
    consumo_interno: string;
    cortesias:       string;
    love_points:     string;
}

export interface EarlyCheckin {
    cantidad:        number;
    precio_promedio: number;
    total:           number;
    concepto?:       string;
}

export interface FoliosCorte {
    fecha_fin_corte:    Date;
    fecha_inicio_corte: Date;
    folio:              number;
}

export interface Restaurante {
    desgloce: any[];
    totales:  Totales;
}

export interface Totales {
    cantidad_total:        number;
    monto_total:           number;
    precio_promedio_total: number;
}

export interface Egresos {
    consumo_interno:         number;
    cortesias:               number;
    love_points:             number;
    metodos_pago_cancelados: ResultadoCorte;
    total_gastos:            number;
}

export interface ResultadoCorte {
    amex:                   number;
    anticipos_validos:      string;
    consumo_interno:        number;
    cortesia:               number;
    deposito_transferencia: number;
    efectivo:               number;
    visa_o_mastercard:      number;
    love_points?:           number;
    experiencias?:          number;
    gastos?:                number;
}

export interface InformacionAnticiposValidos {
    experiencias: Experiencias;
    extras:       Extras;
    habitaciones: Extras;
}

export interface Experiencias {
    cantidad: number;
    total:    string;
}

export interface Extras {
    cantidad: number;
    total:    number;
}

export interface TotalesPDF {
    sub_total: number;
    total:     number;
}

export interface ManejoEfectivo {
    fajillas?:              any[];
    efectivo_caja:          number;
    total_manejo_efectivo:  number;
}

export interface TicketsPromedio {
    restaurante:    number;
    room_service:   number;
    estancia:       number;
}

export interface ResumenPropinas {
    utilidad_propinas:              number;
    comision_bancaria:              number;
    monto_recaudado:                number;
    porcentaje_comision_por_puntos: number;
}