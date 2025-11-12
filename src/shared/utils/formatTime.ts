export function formatTime({ time, withHours = false }: { time: string; withHours?: boolean }) {
    try {
        const [minutes, seconds] = time.split(":").map(Number)
        
        if (isNaN(minutes) || isNaN(seconds)) {
            return "00:00"
        }

        // Si se supera el límite de 60 minutos y withHours es true, convertimos a horas
        if (minutes >= 60 && withHours) {
            const hours = Math.floor(minutes / 60)
            const remainingMinutes = minutes % 60
            return `${hours.toString().padStart(2, "0")}:${remainingMinutes.toString().padStart(2, "0")}`
        } else {
            // Mantenemos el formato mm:ss
            return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        }
    } catch (error) {
        console.error("Error formatting time:", error)
        return "00:00"
    }
}
