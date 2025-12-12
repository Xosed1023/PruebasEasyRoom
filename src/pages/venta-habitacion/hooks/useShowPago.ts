import { useState } from "react"

const useShowPago = ({ isFromReserva }: { isFromReserva: boolean }) => {
    const [isShowingPago, setIsShowingPagoP] = useState(false)
    const setIsShowingPago = ({ totalRenta }: { totalRenta: number }) => {
        if (!isFromReserva || isNaN(totalRenta)) {
            return setIsShowingPagoP(true)
        }
        if (totalRenta > 0) {
            return setIsShowingPagoP(true)
        }
        setIsShowingPagoP(false)
    }

    return { isShowingPago, setIsShowingPago }
}

export default useShowPago


