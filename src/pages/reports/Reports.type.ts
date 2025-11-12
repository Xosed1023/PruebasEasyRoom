export enum ReportsSubSections {
    // Reportes de habitacion
    historialHabitaciones = "Estados de habitación",
    historialHuespedes = "Base de huéspedes",
    historialLimpieza = "Limpieza y supervisión",
    historialVentasYReserva = "Ventas y reservas",
    // Reportes de finanzas
    historialArtVendidos = "Artículos vendidos",
    historialGastos = "Gastos",
    historialPropinas = "Propinas",
    // Reportes de operación
    historialDeExistenciaInventarios = "Existencia de inventario",
    historialDeMovimientosInventarios = "Movimientos de inventario",
    historialEnergeticos = "Energéticos",
    historialIncidencias = "Incidencias",
    historialMantenimiento = "Mantenimiento",
    historialMatriculas = "Matriculas",
}

export enum ReportsSections {
    habitacion = "Reportes de habitación",
    operacion = "Reportes de operación",
    finanzas = "Reportes de finanzas",
}

export const ReportsOptions = {
    // Reportes de habitacion
    habs: {
        title: ReportsSections.habitacion,
        value: ReportsSubSections.historialHabitaciones,
    },
    huespedes: {
        title: ReportsSections.habitacion,
        value: ReportsSubSections.historialHuespedes,
    },
    limpSup: {
        title: ReportsSections.habitacion,
        value: ReportsSubSections.historialLimpieza,
    },
    ventasHabYReservas: {
        title: ReportsSections.habitacion,
        value: ReportsSubSections.historialVentasYReserva,
    },
    // Reportes de finanzas
    artVendidos: {
        title: ReportsSections.finanzas,
        value: ReportsSubSections.historialArtVendidos,
    },
    gastos: {
        title: ReportsSections.finanzas,
        value: ReportsSubSections.historialGastos,
    },
    propinas: {
        title: ReportsSections.finanzas,
        value: ReportsSubSections.historialPropinas,
    },
    // Reportes de operación
    existenciaInventario: {
        title: ReportsSections.operacion,
        value: ReportsSubSections.historialDeExistenciaInventarios,
    },
    movimientosInventario: {
        title: ReportsSections.operacion,
        value: ReportsSubSections.historialDeMovimientosInventarios,
    },
    energeticos: {
        title: ReportsSections.operacion,
        value: ReportsSubSections.historialEnergeticos,
    },
    matriculas: {
        title: ReportsSections.operacion,
        value: ReportsSubSections.historialMatriculas,
    },
    incidencias: {
        title: ReportsSections.operacion,
        value: ReportsSubSections.historialIncidencias,
    },
    mantenimiento: {
        title: ReportsSections.operacion,
        value: ReportsSubSections.historialMantenimiento,
    },
}
