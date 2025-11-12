/**
 * Toma dos fechas y devuelve la diferencia en string en la forma N día(s) HH:MM:SShrs
 * @param startDate 
 * @param endDate 
 * @returns 
 */
export function formatDiffTimeLong(startDate: Date, endDate: Date): string {

    if(isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return "-"
    }

    const tiempoRestante = endDate.getTime() - startDate.getTime();

    if (tiempoRestante < 0) {
        return '-';
    }

    const dias = Math.floor(tiempoRestante / (1000 * 60 * 60 * 24));
    const horas = Math.floor((tiempoRestante % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((tiempoRestante % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((tiempoRestante % (1000 * 60)) / 1000);

    const formatoDias = dias > 0 ? `${dias} día(s), ` : '';
    const formatoHoras = horas.toString().padStart(2, '0');
    const formatoMinutos = minutos.toString().padStart(2, '0');
    const formatoSegundos = segundos.toString().padStart(2, '0');

    return `${formatoDias}${formatoHoras}:${formatoMinutos}:${formatoSegundos}hrs`;
}