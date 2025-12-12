import { useDispatch } from "react-redux"
import { startGetSelectedRoom } from "./store/thunks/rooms.thunk"
import { useRoom } from "./room-detail/hooks"
import { useRoomDarwer } from "./room-detail/hooks/darwer"

export function useHome() {
    const room = useRoom()
    const dispatch = useDispatch()
    const { visible } = useRoomDarwer()

    const handleUpdateSelectedRoom = (rooms: any[]) => {
        const roomId = room?.habitacion_id

        if (visible && roomId) {
            const findRoom = rooms.find(({ habitacion_id }) => roomId === habitacion_id)

            if (findRoom) dispatch(startGetSelectedRoom(findRoom?.habitacion_id, true))
        }
    }

    return {
        handleUpdateSelectedRoom,
    }
}
