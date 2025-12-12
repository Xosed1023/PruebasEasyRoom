import { useState } from "react"

const useShowPagoReserva = ({ isFromReserva }: { isFromReserva: boolean }) => {
    const [isShowingPagoReserva, setIsShowingPagoP] = useState(false)

    const setIsShowingPagoReserva = ({ totalRenta }: { totalRenta: number }) => {
        if (!isFromReserva || isNaN(totalRenta)) {
            return setIsShowingPagoP(true);
        }
        if (totalRenta === 0) {
            return setIsShowingPagoP(true)
        }
        setIsShowingPagoP(false) 
    }

    return { isShowingPagoReserva, setIsShowingPagoReserva }
}

export default useShowPagoReserva