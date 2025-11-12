/**
 * Toma dos fechas y devuelve la diferencia en formato de cadena en la forma HH:MM:SS
 * @param startDate 
 * @param endDate 
 * @returns {string} Diferencia en formato HH:MM:SS
 */
export function formatDiffTimeShort(startDate: Date, endDate: Date): string {

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return "-";
    }

    const tiempoRestante = endDate.getTime() - startDate.getTime();

    if (tiempoRestante < 0) {
        return '-';
    }

    const horas = Math.floor(tiempoRestante / (1000 * 60 * 60));
    const minutos = Math.floor((tiempoRestante % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((tiempoRestante % (1000 * 60)) / 1000);

    const formatoHoras = horas.toString().padStart(2, '0');
    const formatoMinutos = minutos.toString().padStart(2, '0');
    const formatoSegundos = segundos.toString().padStart(2, '0');

    return `${formatoHoras}:${formatoMinutos}:${formatoSegundos}`;
}
