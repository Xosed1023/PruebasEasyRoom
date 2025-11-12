import React, { useEffect, useState } from "react"
import { DatePickerInfoProps } from "./date-picker"
import InputText from "../input-text/InputText"
import Icon from "src/shared/icons"

const DatePickerInfo: React.FC<DatePickerInfoProps> = ({
    setIsDatePickerOpen,
    isDatePickerOpen,
    dateSelect,
    placeholder,
    monthShort,
    errorHintText,
    currMonth,
    className,
    currYear,
    label,
    iconMode = false,
}) => {
    const [value, setValue] = useState("")

    useEffect(() => {
        let text =
            dateSelect && dateSelect.length > 0
                ? `${monthShort[dateSelect[0].getMonth()]} ${dateSelect[0].getDate()}, ${dateSelect[0].getFullYear()}`
                : ""
        if (dateSelect.length > 1) {
            text =
                text +
                ` - ${
                    monthShort[dateSelect[1].getMonth()]
                } ${dateSelect?.[1]?.getDate?.()}, ${dateSelect[1].getFullYear()}`
        }
        setValue(text)
    }, [dateSelect])

    return (
        <InputText
            placeholder={placeholder}
            type="text"
            label={label}
            className={className}
            icon={Icon}
            iconProps={{
                name: "calendarFill",
            }}
            error={!!errorHintText}
            errorhinttext={errorHintText || ""}
            onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
            value={value}
        />
    )
}

export default DatePickerInfo
