import { useState, useEffect } from "react"

const useClock = (): string => {
    const [time, setTime] = useState(new Date().toLocaleTimeString())

    useEffect(() => {
        // Actualizar la hora cada segundo
        const intervalID = setInterval(() => {
            setTime(new Date().toLocaleTimeString())
        }, 1000)

        // Limpia el intervalo cuando el componente se desmonta
        return () => clearInterval(intervalID)
    }, [])

    return time
}

export default useClock
