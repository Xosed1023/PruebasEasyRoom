import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setAuth } from "src/store/restaurant/restaurantSlice"
import { RootState } from "src/store/store"

const useRestaurantAuth = () => {
    const { auth, isDrawerOpen } = useSelector((root: RootState) => root.restaurant)
    const dispatch = useDispatch()
    const setAuthValue = (
        v: {
            codigo?: string
            template_sample?: string
        } | null
    ) => {
        dispatch(setAuth(v))
    }

    useEffect(() => {
        if (!isDrawerOpen) {
            dispatch(setAuth(null))
        }
    }, [isDrawerOpen])

    return { auth, setAuthValue }
}

export default useRestaurantAuth
