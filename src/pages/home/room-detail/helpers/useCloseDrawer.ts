import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toggleRoomDetailsDrawer } from "src/store/navigation/navigationSlice"
import { RootState } from "src/store/store"



export const useCloseDrawer = (onClose?: () => void) => {
    const dispatch = useDispatch()

    const {isRoomDetailsDrawerOpen} = useSelector((root: RootState) => root.navigation)

    useEffect(() => {
        if(!isRoomDetailsDrawerOpen) {
            onClose?.()
        }
    }, [isRoomDetailsDrawerOpen])
    

    const closeDrawer = () => {
        dispatch(toggleRoomDetailsDrawer(false))
    }

    return { closeDrawer }
}