import { useState } from "react"

const useLoadingState = () => {
    // Loading para mostrar que un proceso está cargando en tiempo real
    const [isLoading, setIsLoading] = useState(false)
    // Loading con retraso en tiempo para deshabilitar botones o lugares donde haya riesgo de hacer registros duplicados
    const [isLoadingDelayed, setIsLoadingDelayed] = useState(false)

    const toggleIsLoading = ({ value = false, timeout = 500 }: { value: boolean; timeout?: number }) => {
        setIsLoading(value)
        if (value) {
            return setIsLoadingDelayed(value)
        }
        // Retrasar la habilitacion para evitar duplicaciones
        setTimeout(() => {
            setIsLoadingDelayed(value)
        }, timeout)
    }

    return { toggleIsLoading, isLoading, isLoadingDelayed }
}

export default useLoadingState
