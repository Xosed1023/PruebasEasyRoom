import { StatusEstanciaExtraTypes } from "./status.type"
import isTimeout from "../isTimeout"

const getStatusEstanciaExtra = ({
    occupiedTimeEndCondensada,
    now,
    occupiedTimeEnd,
}: {
    occupiedTimeEndCondensada: string
    occupiedTimeEnd: string
    now: Date
}) => {
    if (occupiedTimeEnd === occupiedTimeEndCondensada) {
        return StatusEstanciaExtraTypes.NA
    }

    return isTimeout({
        date: occupiedTimeEndCondensada,
        now,
    })
        ? StatusEstanciaExtraTypes.Expirada
        : StatusEstanciaExtraTypes.NoExpirada
}

export default getStatusEstanciaExtra
