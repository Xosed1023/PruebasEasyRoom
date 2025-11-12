import { formatUTCDate } from "./formatDateUTC"

export const formatElapsedTime = ({startDateUTC, abbreviated, label, currentTime} :{startDateUTC: Date, label?: string, abbreviated?: boolean, currentTime: Date}): [string] => {
    const elapsedTime = new Date(currentTime.getTime?.() - startDateUTC.getTime?.())

    const formattedElapsedTime = formatUTCDate(elapsedTime, label, abbreviated)

    return [formattedElapsedTime]
}
