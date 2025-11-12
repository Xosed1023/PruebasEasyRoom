import { useDispatch, useSelector } from "react-redux"
import { toggleRoomDetailsDrawer } from "src/store/navigation/navigationSlice"
import { selectBloqueadaSection } from "src/store/roomDetails/bloqueadaSlice"
import { selectCleaningSection } from "src/store/roomDetails/cleaningSlice"
import { selectMaintenanceSection } from "src/store/roomDetails/maintenance.Slice"
import { selectPendienteSupervisionSection } from "src/store/roomDetails/pendienteSupervisionSlice"
import { selectRoom } from "src/store/rooms/roomsSlice"
import { RootState } from "src/store/store"

export function useRoomDarwer() {
    const { isRoomDetailsDrawerOpen } = useSelector((state: RootState) => state.navigation)
    const dispatch = useDispatch()

    return {
        visible: isRoomDetailsDrawerOpen,
        onClose: () => {
            dispatch(selectPendienteSupervisionSection("home"))
            dispatch(selectBloqueadaSection("home"))
            dispatch(selectCleaningSection("home"))
            dispatch(selectMaintenanceSection("home"))
            dispatch(toggleRoomDetailsDrawer(false))
            dispatch(selectRoom({}))
        },
        onOpen: () => dispatch(toggleRoomDetailsDrawer(true)),
    }
}
