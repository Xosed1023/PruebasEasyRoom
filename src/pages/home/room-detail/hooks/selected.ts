import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { RootState } from "src/store/store"

export function useSelectedRoom() {
    const params = useParams()
    const habitacion_id = params?.habitacion_id
    const roomList = useSelector((state: RootState) => state.rooms.rooms)
    const room = roomList.find((item) => item.habitacion_id === habitacion_id)

    return {
        ...room,
        habitacion_id: room?.habitacion_id || "",
        nombre: `${room?.tipo_habitacion?.nombre || "Habitación"} ${room?.numero_habitacion}`,
        colaborador_tarea_id: room?.colaborador_tarea?.colaborador_tarea_id || "",
    }
}
