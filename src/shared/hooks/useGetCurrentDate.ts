import { useCurrentDateQuery } from "src/gql/schema"
import { useDate } from "./useDate"

const useGetCurrentDate = () => {
    const { data } = useCurrentDateQuery()
    const { UTCStringToLocalDate } = useDate()
    return { currentDate: UTCStringToLocalDate(data?.serverDate) }
}

export default useGetCurrentDate
