import { monthNames } from "../../forms/datapicker/date-picker"
import "./CalendarPaginator.css"
import Icon from "src/shared/icons"

const CalendarPaginator = ({
    mode,
    value,
    onChange,
}: {
    mode: "month" | "year"
    value: Date
    onChange?: (value: Date) => void
}) => {
    const handleClick = (changeValue: number) => {
        const date = new Date(value)
        if (mode === "year") {
            date.setFullYear(date.getFullYear() + changeValue)
            onChange?.(date)
            return
        }
        if (date.getMonth() <= 0 && changeValue < 0) {
            date.setFullYear(date.getFullYear() + changeValue)
            date.setMonth(11)
        } else if (date.getMonth() >= 11 && changeValue > 0) {
            date.setFullYear(date.getFullYear() + changeValue)
            date.setMonth(0)
        } else {
            date.setMonth(date.getMonth() + changeValue)
        }
        onChange?.(date)
    }

    return (
        <div className="calendar-paginator" style={{ minWidth: mode === "month" ? "175px" : "" }}>
            <button className="calendar-paginator-btn" onClick={() => handleClick(-1)}>
                <Icon width={14} height={14} name="chevronleft" color="var(--primary)" />
            </button>
            <p>{mode === "month" ? monthNames[value.getMonth()] : value.getFullYear()}</p>
            <button className="calendar-paginator-btn" onClick={() => handleClick(+1)}>
                <Icon width={14} height={14} name="chevronRight" color="var(--primary)" />
            </button>
        </div>
    )
}

export default CalendarPaginator
