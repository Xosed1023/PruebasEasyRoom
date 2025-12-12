import React from "react"
import Icon from "src/shared/icons"
import { DatePickerInDisplayInfoProps } from "./datapicker-in-display.props"

const DatePickerInDisplayInfo: React.FC<DatePickerInDisplayInfoProps> = ({
    dateSelect,
    errorhinttext,
    placeholder,
    monthShort,
    iconMode,
}) => {
    return (
        <div className={`date-picker-in-display-info ${errorhinttext ? "error" : ""}`}>
            <span className="date-picker-in-display-info__icon">
                <Icon color="var(--header)" name="calendarSquare" />
            </span>
            {!iconMode && dateSelect.length === 0 && (
                <p className="date-picker-in-display-info__placeholder">{placeholder}</p>
            )}
            {!iconMode && dateSelect.length > 0 && (
                <div className="date-picker-in-display-info__container-date_selected">
                    <p className="date-picker-in-display-info__date-select">
                        {`${
                            monthShort[dateSelect[0].getMonth()]
                        } ${dateSelect[0].getDate()}, ${dateSelect[0].getFullYear()}`}
                    </p>
                    {dateSelect[1] && <div className="date-picker-in-display-info__date-select">-</div>}
                    {dateSelect[1] && (
                        <p className="date-picker-in-display-info__date-select">
                            {`${
                                monthShort[dateSelect[1].getMonth()]
                            } ${dateSelect[1].getDate()}, ${dateSelect[1].getFullYear()}`}
                        </p>
                    )}
                </div>
            )}
        </div>
    )
}

export { DatePickerInDisplayInfo }
