import { createDateUtils } from "src/shared/hooks/useDate"
import { StatusIsUsingExtraTime } from "./status.type"

const getIsUsingExtraTime = ({
    occupiedTimeEnd,
    occupiedTimeEndCondensada,
    now,
    roomNumber,
}: {
    occupiedTimeEnd: string
    occupiedTimeEndCondensada: string
    now: Date
    roomNumber: string
}): StatusIsUsingExtraTime => {
    const { UTCStringToLocalDate } = createDateUtils()

    if (occupiedTimeEnd === occupiedTimeEndCondensada) {
        return StatusIsUsingExtraTime.No
    }
    if (occupiedTimeEnd !== occupiedTimeEndCondensada && now > UTCStringToLocalDate(occupiedTimeEndCondensada)) {
        return StatusIsUsingExtraTime.Yes
    }
    if (UTCStringToLocalDate(occupiedTimeEnd) < now && now < UTCStringToLocalDate(occupiedTimeEndCondensada)) {
        return StatusIsUsingExtraTime.Yes
    }
    if (now < UTCStringToLocalDate(occupiedTimeEnd)) {
        return StatusIsUsingExtraTime.No
    }
    return StatusIsUsingExtraTime.No
}

export default getIsUsingExtraTime
