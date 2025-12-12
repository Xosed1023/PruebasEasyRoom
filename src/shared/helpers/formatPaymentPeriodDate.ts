export const formatPaymentPeriodDate = (fechas: Date[]): string => {
    if (fechas.length === 0 || !(fechas[0] instanceof Date)) {
        return "-";
    }

    const formatFechaCorta = (fecha: Date): string => {
        const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
        const dia = String(fecha.getDate()).padStart(2, "0");
        const mes = meses[fecha.getMonth()]; 
        return `${dia} ${mes}`;
    };

    const primeraFecha = new Date(fechas[0]);
    const ultimaFecha = new Date(fechas[fechas.length - 1]);

    const fechaInicio = formatFechaCorta(primeraFecha);
    const fechaFin = formatFechaCorta(ultimaFecha);

    if (fechas.length === 1) {
        return `${fechaInicio} al ${fechaInicio} de ${primeraFecha.getFullYear()}`;
    }

    const mesInicio = primeraFecha.getMonth();
    const mesFin = ultimaFecha.getMonth();
    if (mesInicio === mesFin) {
        return `${fechaInicio} al ${fechaFin} de ${primeraFecha.getFullYear()}`;
    }

    return `${fechaInicio} al ${fechaFin} de ${primeraFecha.getFullYear()}`;
};