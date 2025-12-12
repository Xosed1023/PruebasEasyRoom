import isTimeout from "../isTimeout"
import { StatusTypes } from "./status.type"

export const getStatusRenta = ({
    occupiedTimeEndCondensada,
    now,
}: {
    occupiedTimeEndCondensada: string
    now: Date
}): StatusTypes.Expirada | StatusTypes.NoExpirada => {
    return isTimeout({
        date: occupiedTimeEndCondensada,
        now,
    })
        ? StatusTypes.Expirada
        : StatusTypes.NoExpirada
}
