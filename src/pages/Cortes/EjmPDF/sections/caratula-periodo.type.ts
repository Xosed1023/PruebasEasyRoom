export interface CaratulaPeriodoType {
    ebitda:                         Ebitda;
    encabezados:                    Encabezados;
    gastos_metodo_pago:             GastosMetodoPago;
    ingresos_estancia:              Ingresos;
    ingresos_metodo_pago:           IngresosMetodoPago;
    ingresos_restaurante:           Ingresos;
    ingresos_roomservice:           Ingresos;
    ingresos_totales:               IngresosTotales;
    resumen_gastos_administrativos: ResumenGastos;
    resumen_gastos_financieros:     ResumenGastos;
    resumen_gastos_hotel:           ResumenGastos;
    utilidad_gop:                   Utilidad;
    utilidad_perdida_neta:          Utilidad;
}

export interface Ebitda {
    promedio_habitacion: number;
    total:               number;
}

export interface Encabezados {
    dias:                        number;
    fecha_fin:                   string;
    fecha_inicio:                string;
    habitaciones_unidad:         number;
    porcentaje_ocupacion:        number;
    promedio_diario_ocupacion:   number;
    total_habitaciones_vendidas: number;
}

export interface GastosMetodoPago {
    bancos:           GastosMetodoPagoBancos;
    efectivo:         MetodoPago;
    total:            number;
    total_porcentaje: number;
}

export interface GastosMetodoPagoBancos {
    amex:                     MetodoPago;
    deposito_o_transferencia: MetodoPago;
    porcentaje_bancos:        number;
    total_bancos:             number;
    visa_o_mastercard:        MetodoPago;
}

export interface MetodoPago {
    porcentaje_concepto: number;
    total:               number;
}

export interface Ingresos {
    detalles: Detalle[];
    totales:  IngresosEstanciaTotales;
}

export interface Detalle {
    cantidad:            number;
    concepto:            string;
    porcentaje_concepto: number;
    precio_promedio:     number;
    total_venta:         number;
}

export interface IngresosEstanciaTotales {
    cantidad:            number;
    porcentaje_concepto: number;
    total_venta:         number;
}

export interface IngresosMetodoPago {
    bancos:           IngresosMetodoPagoBancos;
    efectivo:         IngresosMetodoPagoEfectivo;
    otros:            Otros;
    total:            string;
    total_porcentaje: number;
}

export interface IngresosMetodoPagoBancos {
    amex:                     Amex;
    deposito_o_transferencia: Amex;
    porcentaje_bancos:        number;
    total_bancos:             number;
    visa_o_mastercard:        Amex;
}

export interface Amex {
    porcentaje_concepto: number;
    total:               string;
}

export interface IngresosMetodoPagoEfectivo {
    porcentaje_efectivo: number;
    total_efectivo:      string;
}

export interface Otros {
    consumo_interno:  Amex;
    cortesia:         MetodoPago;
    love_points:      MetodoPago;
    porcentaje_otros: number;
    total_otros:      number;
}

export interface IngresosTotales {
    hotel:          Hotel;
    propinas_total: PropinasTotal;
    restaurante:    Hotel;
    room_service:   Hotel;
    total:          Hotel;
}

export interface Hotel {
    promedio_diario:     number;
    promedio_habitacion: number;
    total:               number;
}

export interface PropinasTotal {
    promedio_diario:     string;
    promedio_habitacion: string;
    total:               string;
}

export interface ResumenGastos {
    detalles: TotalesElement[];
    totales:  TotalesElement;
}

export interface TotalesElement {
    porcentaje_venta:    number;
    promedio_habitacion: number;
    total_gasto:         number;
    categoria?:          string;
}

export interface Utilidad {
    porcentaje_utilidad: number;
    total:               number;
}
