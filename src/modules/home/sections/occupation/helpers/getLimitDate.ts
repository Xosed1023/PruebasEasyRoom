import { dateHelpers } from "@/helpers/dateHelpers"

export const getLimitDate = (date: string) => {
    const {UTCStringToLocalDate} = dateHelpers()
    const origin = UTCStringToLocalDate(date)
    const current = new Date()

    return {
        current: origin.getTime(),
        min: new Date(current.getFullYear(), current.getMonth(), current.getDate()).getTime(),
        max: new Date(current.getFullYear(), current.getMonth(), current.getDate(), 23, 59).getTime(),
    }
}