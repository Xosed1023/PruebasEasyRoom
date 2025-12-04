import { sum } from "@/helpers/calculator"
import { getPercent } from "../../../helpers/getPercent"

export const getReachedPercent = ({
    occupiedRoomsNotCheckOut = 0,
    bookingsWithCheck = 0,
    localRentas = 0,
    rooms = 0,
}) => {
    return getPercent(sum([occupiedRoomsNotCheckOut, bookingsWithCheck, localRentas]), rooms)
}