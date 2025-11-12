import { add, sum } from "src/shared/helpers/calculator"
import { getPercent } from "./percent"

export const getExpectedPercent = ({ occupiedRoomsNotCheckOut = 0, todayBookings = 0, rooms = 0 }) => {
    return getPercent(add(occupiedRoomsNotCheckOut, todayBookings), rooms)
}

export const getReachedPercent = ({
    occupiedRoomsNotCheckOut = 0,
    bookingsWithCheck = 0,
    localRentas = 0,
    rooms = 0,
}) => {
    return getPercent(sum([occupiedRoomsNotCheckOut, bookingsWithCheck, localRentas]), rooms)
}
