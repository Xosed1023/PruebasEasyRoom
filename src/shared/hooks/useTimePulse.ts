import { useCurrentDate } from "../providers/CurrentdateProvider"

export const useTimePulse = () => {
    const [date] = useCurrentDate()

    return [date]
}
