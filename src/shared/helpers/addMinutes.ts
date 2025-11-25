import { createDateUtils } from "../hooks/useDate"

const addMinutes = ({utcDate, minutes}:{utcDate: string, minutes: number}) => {
    const { UTCStringToLocalDate } = createDateUtils()
    const manipulableDate = UTCStringToLocalDate(utcDate)
    return new Date(manipulableDate.setMinutes(manipulableDate.getMinutes() + (minutes || 0)))
}

export default addMinutes