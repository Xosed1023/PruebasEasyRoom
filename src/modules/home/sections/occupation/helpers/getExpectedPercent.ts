import { add } from "@/helpers/calculator"
import { getPercent } from "../../../helpers/getPercent"

export const getExpectedPercent = ({ occupiedRoomsNotCheckOut = 0, todayBookings = 0, rooms = 0 }) => {
    return getPercent(add(occupiedRoomsNotCheckOut, todayBookings), rooms)
}