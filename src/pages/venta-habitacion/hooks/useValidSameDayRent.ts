import { useEffect, useState } from "react"
import { useCurrentDateQuery } from "src/gql/schema"
import { useDate } from "src/shared/hooks/useDate"

const useValidSameDayRent = (horaCheckIn = "00:00:00+00", hasReservation?: boolean, horaCheckOut = "00:00:00+00") => {
    const { data, refetch } = useCurrentDateQuery()

    // 12pm -> medio día, 12am -> media noche
    const [isBetween12AMAndCheckInHour, setisBetween12AMAndCheckInHour] = useState<boolean>(false)
    const [isBetween12AMAndCheckOutHour, setisBetween12AMAndCheckOutHour] = useState<boolean>(false)

    const { setHHMMSS, UTCStringToLocalDate } = useDate()

    useEffect(() => {
        refetch()
    }, [horaCheckIn, horaCheckOut])

    useEffect(() => {
        const isValidBetween12AMAndCheckInHour =
            setHHMMSS({
                startDate: UTCStringToLocalDate(data?.serverDate),
                newHour: "00:00:00",
                isNewHourInUTC: false,
            }) < UTCStringToLocalDate(data?.serverDate) &&
            setHHMMSS({
                startDate: UTCStringToLocalDate(data?.serverDate),
                newHour: horaCheckIn,
                isNewHourInUTC: true,
            }) > UTCStringToLocalDate(data?.serverDate)
        setisBetween12AMAndCheckInHour(hasReservation ? false : isValidBetween12AMAndCheckInHour)
    }, [data])

    useEffect(() => {
        const isValid12AMAndCheckOutHour =
            setHHMMSS({
                startDate: UTCStringToLocalDate(data?.serverDate),
                newHour: "00:00:00",
                isNewHourInUTC: false,
            }) < UTCStringToLocalDate(data?.serverDate) &&
            setHHMMSS({
                startDate: UTCStringToLocalDate(data?.serverDate),
                newHour: horaCheckOut,
                isNewHourInUTC: true,
            }) > UTCStringToLocalDate(data?.serverDate)
        setisBetween12AMAndCheckOutHour(isValid12AMAndCheckOutHour)
    }, [data])

    return { isBetween12AMAndCheckInHour, isBetween12AMAndCheckOutHour }
}

export default useValidSameDayRent
