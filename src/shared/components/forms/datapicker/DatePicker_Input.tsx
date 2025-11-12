import { useEffect, useState } from "react"
import { DatePickerInputProps } from "./date-picker"
import DatePickerInfo from "./DatePicker_Info"
import DatapickerCalendar from "./Datapicker_Calendar"
import BgBlur from "../../layout/BgBlur/BgBlur"
import { useDate } from "src/shared/hooks/useDate"

const DatePickerInput: React.FC<DatePickerInputProps> = ({
    passSelect = false,
    placeholder = "",
    event,
    iconMode,
    className,
    range,
    diffMonthDaysSelectable,
    value,
    onChange,
    errorHintText,
    secondary,
}) => {
    const { UTCStringToLocalDate } = useDate()
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
    const [dateSelect, setDateSelect] = useState<Date[]>(
        value?.map((v) => UTCStringToLocalDate(v)) || []
    )

    useEffect(() => {
        setDateSelect(value?.map((v) => UTCStringToLocalDate(v)) || [])
    }, [value])

    const [currMonth, setCurrMonth] = useState(new Date().getMonth())
    const [currYear, setCurrYear] = useState(new Date().getFullYear())

    const monthNames = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
    ]

    const monthShort = monthNames.map((month) => month.slice(0, 3))

    return (
        <div>
            <DatePickerInfo
                setIsDatePickerOpen={setIsDatePickerOpen}
                isDatePickerOpen={isDatePickerOpen}
                placeholder={placeholder}
                label="Fecha de salida"
                currMonth={currMonth}
                iconMode={iconMode}
                currYear={currYear}
                monthShort={monthShort}
                className={className}
                errorHintText={errorHintText}
                dateSelect={dateSelect}
            />
            {!!isDatePickerOpen && <BgBlur visible={isDatePickerOpen} />}
            {isDatePickerOpen && (
                <DatapickerCalendar
                    secondary={secondary}
                    iconMode
                    passSelect={passSelect}
                    diffMonthDaysSelectable={diffMonthDaysSelectable}
                    monthNames={monthNames}
                    isDatePickerOpen={isDatePickerOpen}
                    dateSelect={dateSelect}
                    range={range}
                    onChange={onChange}
                    setDateSelect={setDateSelect}
                    setIsDatePickerOpen={setIsDatePickerOpen}
                    currMonth={currMonth}
                    setCurrMonth={setCurrMonth}
                    currYear={currYear}
                    setCurrYear={setCurrYear}
                    event={event}
                />
            )}
        </div>
    )
}

export default DatePickerInput
