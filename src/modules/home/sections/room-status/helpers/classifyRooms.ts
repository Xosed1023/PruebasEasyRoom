import { Estados_Habitaciones, Habitacion } from "@/gql/schema"

const classifyRooms = ({ rooms }: { rooms: Habitacion[] }) => {
    let roomsGroups = {
        [Estados_Habitaciones.ALaVenta]: 0,
        [Estados_Habitaciones.Bloqueada]: 0,
        [Estados_Habitaciones.Limpieza]: 0,
        [Estados_Habitaciones.Mantenimiento]: 0,
        [Estados_Habitaciones.Ocupada]: 0,
        [Estados_Habitaciones.Preparada]: 0,
        [Estados_Habitaciones.Reservada]: 0,
        [Estados_Habitaciones.Sucia]: 0,
        [Estados_Habitaciones.SupervisionPendiente]: 0,
    }
    rooms.map((room) => {
        if (Object.keys(roomsGroups).includes(room.estado)) {
            roomsGroups[room.estado] += 1
        }
    })
    return { roomsGroups }
}

export default classifyRooms
