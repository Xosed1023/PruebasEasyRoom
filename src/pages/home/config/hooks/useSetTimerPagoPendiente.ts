import { useState, useEffect } from "react"
import { useConvertToHotelTime } from "src/shared/hooks/useElapseTimeHotel"

export const useSetTimerPagoPendiente = (startTime: Date, zonaHoraria: string) => {
    const [timePagoPendiente, setTimePagoPendiente] = useState<string>("00:00")

    useEffect(() => {
        const actualizarTimer = () => {
            const registro = useConvertToHotelTime(new Date(startTime), zonaHoraria)
            const ahora = useConvertToHotelTime(new Date(), zonaHoraria)
            const diferencia = ahora.getTime() - registro.getTime()

            const minutos = Math.floor(diferencia / (1000 * 60))
            const segundos = Math.floor((diferencia % (1000 * 60)) / 1000)

            setTimePagoPendiente(`${minutos.toString().padStart(2, "0")}:${segundos.toString().padStart(2, "0")}`)
        }

        actualizarTimer()
        const timerInterval = setInterval(actualizarTimer, 1000)

        return () => clearInterval(timerInterval)
    }, [startTime])

    return timePagoPendiente
}
