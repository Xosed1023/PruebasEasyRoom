import { useEffect, useState } from "react"

const useIsLoadingData = () => {
    const [{isLoadingColaboradores, isLoadingHabitacion, isLoadingTarifas}, setIsDataLoading] = useState<{
        isLoadingColaboradores: boolean
        isLoadingTarifas: boolean
        isLoadingHabitacion: boolean
    }>({ isLoadingColaboradores: true, isLoadingTarifas: true, isLoadingHabitacion: true })

    const setIsLoading = ({ key, value }: { key: "tarifa" | "habitacion" | "colaboradores"; value: boolean }) => {
        switch (key) {
            case "tarifa":
                return setIsDataLoading((d) => ({ ...d, isLoadingTarifas: value }))
            case "colaboradores":
                return setIsDataLoading((d) => ({ ...d, isLoadingColaboradores: value }))
            case "habitacion":
                return setIsDataLoading((d) => ({ ...d, isLoadingHabitacion: value }))
        }
    }

    const [isLoading, setisLoading] = useState(true)

    useEffect(() => {
        if(isLoadingColaboradores || isLoadingHabitacion || isLoadingTarifas) {
            return setisLoading(true)
        }
        return setisLoading(false)
    }, [isLoadingColaboradores, isLoadingHabitacion, isLoadingTarifas])
    

    return { isLoading, setIsLoading }
}

export default useIsLoadingData
