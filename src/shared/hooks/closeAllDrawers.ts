import { useDispatch } from "react-redux"
import { toggleInventarioDetailDrawer } from "src/store/inventario/inventario.slice"
import { toggleDrawer, toggleProfileDrawer, toggleRoomDetailsDrawer } from "src/store/navigation/navigationSlice"
import { togglePersonalDrawer, togglePersonalTurnoDrawer } from "src/store/personal/personal.slice"
import { setTotalPagoPropinas } from "src/store/propinas/pagoPropinasSlice"
import { selectRoom } from "src/store/reservations/reservationsSlice"
import { selectReservation } from "src/store/roomDetails/reservadaSlice"

const closeAllDrawers = () => {
    const dispatch = useDispatch()

    const closeDrawers = () => {
        dispatch(toggleDrawer(false))
        dispatch(togglePersonalDrawer(false))
        dispatch(togglePersonalTurnoDrawer(false))
        dispatch(toggleProfileDrawer(false))
        dispatch(toggleRoomDetailsDrawer(false))
        dispatch(toggleInventarioDetailDrawer(false))
        dispatch(selectRoom({}))
        dispatch(selectReservation({}))
    }

    const resetToInitialStates = () => {
        // evitar que se muestre el toast de monto excedido al entrar al módulo de pago de propinas
        dispatch(setTotalPagoPropinas(0))
    }

    return { closeDrawers, resetToInitialStates }
}

export default closeAllDrawers
