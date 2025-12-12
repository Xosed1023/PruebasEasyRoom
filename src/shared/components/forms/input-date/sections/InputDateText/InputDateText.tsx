import React, { useEffect, useState } from "react"
import InputText from "../../../input-text/InputText"
import CalendarFill from "src/shared/icons/CalendarFill"

import "./InputDateText.css"
import { mapMonthNumToShortText } from "../../components/MonthDays/helpers"
import { useDate } from "src/shared/hooks/useDate"

const InputDateText = ({
    onClick,
    className,
    placeholder = "",
    label = "",
    value,
    errorHintText = "",
    readOnlyValue = false,
    disabled = false,
}: {
    onClick: () => void
    className?: string
    placeholder?: string
    label?: string
    value: Date[]
    errorHintText?: string
    readOnlyValue?: boolean
    disabled?: boolean
}) => {
    const [text, setText] = useState("")
    const { areSameDay } = useDate()

    useEffect(() => {
        let txt =
            value.length > 0
                ? `${mapMonthNumToShortText(value[0].getMonth())} ${value[0].getDate()}, ${value[0].getFullYear()}`
                : ""

        if (value.length > 1 && areSameDay(value[0], value[1])) {
            setText(txt)
            return
        }
        if (value.length > 1) {
            txt =
                txt +
                ` - ${mapMonthNumToShortText(
                    value[1].getMonth()
                )} ${value?.[1]?.getDate?.()}, ${value[1].getFullYear()}`
        }

        setText(txt)
    }, [value])

    return (
        <InputText
            type="text"
            readOnly={readOnlyValue}
            icon={CalendarFill}
            onClick={onClick}
            iconProps={{ height: 16, width: 16 }}
            inputWrapperClass={`${className ? className : ""}`}
            value={text}
            placeholder={placeholder}
            label={label}
            errorhinttext={errorHintText}
            error={!!errorHintText}
            disabled={disabled}
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    onClick()
                }
            }}
        />
    )
}

export default InputDateText
