import cx from "classnames"
import Icon from "src/shared/icons"
import "./CalendarButtons.css"
import { CalendarButtonsProps } from "./CalendarButtons.props"

const CalendarButtons = ({
    currDay,
    setCurrDay,
    currMonth,
    setCurrMonth,
    currYear,
    setCurrYear,
    monthNames,
    className,
}: CalendarButtonsProps) => {
    const days = new Date(currYear, currMonth + 1, 0).getDate()
    return (
        <div className={cx("calendario-reservaciones__control", className)}>
            <div className="calendario-reservaciones__control-date-month">
                <button
                    className="calendario-reservaciones__control-btn"
                    onClick={() => {
                        if (currMonth <= 0) {
                            setCurrMonth(11)
                        } else {
                            setCurrMonth(currMonth - 1)
                        }
                    }}
                >
                    <Icon name="chevronleft" color="var(--primary)" />
                </button>
                <p>{monthNames[currMonth]}</p>
                <button
                    className="calendario-reservaciones__control-btn"
                    onClick={() => {
                        if (currMonth >= 11) {
                            setCurrMonth(0)
                        } else {
                            setCurrMonth(currMonth + 1)
                        }
                    }}
                >
                    <Icon name="chevronRight" color="var(--primary)" />
                </button>
            </div>
            {currDay && (
                <div className="calendario-reservaciones__control-date-day">
                    <button
                        className="calendario-reservaciones__control-btn"
                        onClick={() => {
                            if (currDay <= 1) {
                                setCurrDay(days)
                            } else {
                                setCurrDay(currDay - 1)
                            }
                        }}
                    >
                        <Icon name="chevronleft" color="var(--primary)" />
                    </button>
                    <p>{currDay}</p>
                    <button
                        className="calendario-reservaciones__control-btn"
                        onClick={() => {
                            if (currDay >= days) {
                                setCurrDay(1)
                            } else {
                                setCurrDay(currDay + 1)
                            }
                        }}
                    >
                        <Icon name="chevronRight" color="var(--primary)" />
                    </button>
                </div>
            )}

            <div className="calendario-reservaciones__control-date-year">
                <button className="calendario-reservaciones__control-btn" onClick={() => setCurrYear(currYear - 1)}>
                    <Icon name="chevronleft" color="var(--primary)" />
                </button>
                <p>{currYear}</p>
                <button className="calendario-reservaciones__control-btn" onClick={() => setCurrYear(currYear + 1)}>
                    <Icon name="chevronRight" color="var(--primary)" />
                </button>
            </div>
        </div>
    )
}
export { CalendarButtons }
