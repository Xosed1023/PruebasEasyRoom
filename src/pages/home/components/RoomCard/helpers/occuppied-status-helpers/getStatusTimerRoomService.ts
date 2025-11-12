import isTimeout from "../isTimeout"
import { StatusTypes } from "./status.type"

const getStatusTimerRoomService = ({
    fecha_registro_orden,
    now,
    fecha_antigua_por_entregar,
}: {
    fecha_registro_orden?: string
    now: Date
    fecha_antigua_por_entregar?: string | null
}): StatusTypes.Expirada | StatusTypes.NoExpirada | StatusTypes.NA => {
    if (fecha_antigua_por_entregar) {
        return isTimeout({
            date: fecha_antigua_por_entregar,
            now,
            minutes: 25,
        })
            ? StatusTypes.Expirada
            : StatusTypes.NoExpirada
    }
    if (!fecha_registro_orden) {
        return StatusTypes.NA
    }

    return isTimeout({
        date: fecha_registro_orden,
        now,
        minutes: 25,
    })
        ? StatusTypes.Expirada
        : StatusTypes.NoExpirada
}

export default getStatusTimerRoomService
