import { useEffect, useState } from "react"

export const useToggleFlag = (init = true) => {
    const [value, setValue] = useState(init)

    useEffect(() => {
        const intervalId = setInterval(() => {
            setValue((v) => !v)
        }, 1000) // Cambiar cada 1 segundo

        return () => clearInterval(intervalId)
    }, [])

    return [value]
}
