import { useEffect, useState } from "react"

export const useTotalTimeHours = (fechaInicio: Date, fechaFin: Date): number => {
    const [totalHours, setTotalHours] = useState<number>(0)

    useEffect(() => {
        // Calcula la diferencia en milisegundos entre las dos fechas
        const diferenciaEnMilisegundos = fechaFin.getTime?.() - fechaInicio.getTime?.()

        // Calcula la diferencia en horas dividiendo por la cantidad de milisegundos en una hora
        const diferenciaEnHoras = diferenciaEnMilisegundos / 36e5 //36e5 obtain hours
        setTotalHours(diferenciaEnHoras)
    }, [fechaInicio, fechaFin])

    return Math.round(totalHours)
}
