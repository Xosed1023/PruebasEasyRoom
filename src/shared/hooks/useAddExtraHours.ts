import { useEffect, useState } from "react"

export const useAddExtraHours = (endDate: Date, hours: number): Date => {
    const endDateCopy = new Date(endDate.getTime?.())

    const [extraHours, setExtraHours] = useState<Date>(new Date())

    useEffect(() => {
        setExtraHours(new Date(endDateCopy.setUTCHours(endDateCopy.getUTCHours() + hours)))
    }, [endDate, hours])

    return extraHours
}
