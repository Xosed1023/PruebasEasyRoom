import addMinutes from "src/shared/helpers/addMinutes"

const isTimeout = ({ date, minutes, now }: { date: string; minutes?: number; now: Date }) => {
    return addMinutes({ utcDate: date, minutes: minutes || 0 }) < now
}

export default isTimeout
