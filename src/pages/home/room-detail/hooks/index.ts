import { useDispatch, useSelector } from "react-redux"
import { RootState } from "src/store/store"
import { selectRoom, updateRoom } from "src/store/rooms/roomsSlice"
import { useRoomDarwer } from "./darwer"
import { startRefetchUpdatedRoom } from "../../store/thunks/rooms.thunk"

export function useRoom() {
    const room = useSelector((state: RootState) => state.rooms.selectedRoom)
    const estado = room?.estado || ""
    return {
        ...room,
        habitacion_id: room?.habitacion_id || "",
        folioRenta: room?.ultima_renta?.folio,
        folioReserva: room?.ultima_reserva?.reserva?.folio,
        estado: `${estado}`.toLowerCase(),
        nombre: `${room?.tipo_habitacion?.nombre || "Habitación"} ${room?.numero_habitacion}`,
        colaborador_tarea_id: room?.colaborador_tarea?.colaborador_tarea_id || "",
        colaborador_id: room?.colaborador_tarea?.colaborador_id,
        limpieza_fecha_termino: room?.ultimos_datos?.ultima_limpieza?.[0]?.fecha_termino,
    }
}

export function useRoomStore() {
    const room = useRoom()
    const dispatch = useDispatch()
    const { onClose } = useRoomDarwer()

    return {
        handleUpdateRoom: (payload: any) => {
            const currentRoom = { ...room, ...payload }
            dispatch(selectRoom(currentRoom))
            dispatch(updateRoom(currentRoom))
        },
        handleFinish: (onEvent?: () => void) => {
            setTimeout(() => {
                if (onEvent) {
                    onEvent()
                } else {
                    onClose()
                }
            }, 0)
        },
        handleFinishPage: () => {
            dispatch(selectRoom({}))
            onClose()
        },
        refetchUpdatedRoom: (habitacion_id) => {
            dispatch(startRefetchUpdatedRoom(habitacion_id))
        },
        optimisticUpdateRoom: (room: any) => {
            dispatch(updateRoom(room))
        }
    }
}
