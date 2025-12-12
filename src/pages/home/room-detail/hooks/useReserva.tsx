import { useDispatch, useSelector } from "react-redux"
import { selectReservation } from "src/store/reservations/reservationsSlice"
import { RootState } from "src/store/store"

export const useReserva = () => {
    const { selectedReservation } = useSelector((root: RootState) => root.reservations)
    const dispatch = useDispatch()

    return { selectedReservation, handleSetReserva: (data: any) => dispatch(selectReservation(data)) }
}