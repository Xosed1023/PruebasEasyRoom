import { useDate } from "../hooks/useDate"

const addMinutes = ({utcDate, minutes}:{utcDate: string, minutes: number}) => {
    const { UTCStringToLocalDate } = useDate()
    const manipulableDate = UTCStringToLocalDate(utcDate)
    return new Date(manipulableDate.setMinutes(manipulableDate.getMinutes() + (minutes || 0)))
}

export default addMinutes