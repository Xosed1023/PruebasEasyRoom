import { useMemo } from "react";

// Convierte la fecha a la zona horaria deseada
export const useConvertToHotelTime = (date: Date, timeZone: string): Date => {
    return new Date(date.toLocaleString("en-MX", { timeZone }));
};

/*
export const useConvertToHotelTime = (date: Date, timeZone: string): Date => {
    const dateString = new Intl.DateTimeFormat("en-MX", {
        timeZone,
        hour12: false,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    }).format(date);
    return new Date(dateString);
}; */

// Calcula los minutos transcurridos según el formato
export const useElapsedMinutes = (elapsedTime: string): number => {
    return useMemo(() => {
        // Si el tiempo está en formato HH:MMh
        if (elapsedTime.includes("h")) {
            const timeParts = elapsedTime.replace('h', '').split(":").map(Number);
            if (timeParts.length === 2) {
                const [hours, minutes] = timeParts;
                return hours * 60 + minutes; 
            }
        }

        // Si el tiempo está en formato MM:SS
        else if (elapsedTime.includes(":")) {
            const timeParts = elapsedTime.split(":").map(Number);
            if (timeParts.length === 2) {
                const [minutes, seconds] = timeParts;
                return minutes + Math.floor(seconds / 60);
            }
        }
        // Si el tiempo es en días
        else if (elapsedTime.includes("día")) {
            const days = parseInt(elapsedTime.split(" ")[0]);
            return days * 24 * 60; 
        }
        return 0; 
    }, [elapsedTime]);
};