import { parseTimeString } from "./parseTimeString";

/**
 * 
 * @param timeString la funcion debe recibir un string como este: "09:00:00" y lo transforma a "9:00 AM"
 * @returns 
 */
export function formatTime12hrs(timeString: string): string | null {
    const parsedTime = parseTimeString(timeString);

    if (!parsedTime) {
        console.error("No se pudo parsear la hora.");
        return null;
    }

    const hours = parsedTime.getHours();
    const minutes = parsedTime.getMinutes();

    const amOrPm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; // Si las horas son 0, muestra 12 en lugar de 0

    return `${formattedHours}:${minutes < 10 ? "0" : ""}${minutes} ${amOrPm}`;
}