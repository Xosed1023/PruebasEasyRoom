import { useDispatch, useSelector } from "react-redux"
import { RootState } from "src/store/store"
import {
    setMesa,
    setOrdenMesa,
    toggleRestaurantDrawer,
    toggleRestaurantLoading,
} from "src/store/restaurant/restaurantSlice"

export function useRestaurantDarwer() {
    const { isDrawerOpen, loading, mesa } = useSelector((state: RootState) => state.restaurant)
    const dispatch = useDispatch()

    return {
        visible: isDrawerOpen,
        loading,
        onClose: () => {
            dispatch(toggleRestaurantDrawer(false))
            dispatch(toggleRestaurantLoading(true))
        },
        onOpen: () => dispatch(toggleRestaurantDrawer(true)),
        setMesa: (mesa: any) => dispatch(setMesa(mesa)),
        setOrdenMesa: (orden_id: string) => {
            if (!mesa?.asignacion_actual?.orden_id) dispatch(setOrdenMesa(orden_id))
        },
        onStopLoading: () => dispatch(toggleRestaurantLoading(false)),
    }
}
