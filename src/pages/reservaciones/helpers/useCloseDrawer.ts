import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toggleDrawer } from "src/store/navigation/navigationSlice"
import { RootState } from "src/store/store"



export const useCloseDrawer = (onClose?: () => void) => {
    const dispatch = useDispatch()

    const {isDrawerOpen} = useSelector((root: RootState) => root.navigation)

    useEffect(() => {
        if(!isDrawerOpen) {
            onClose?.()
        }
    }, [isDrawerOpen])
    

    const closeDrawer = () => {
        dispatch(toggleDrawer(false))
    }

    return { closeDrawer }
}