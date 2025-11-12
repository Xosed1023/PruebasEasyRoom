import { useState } from "react"
import cx from "classnames"
import { DatePickerInputProps } from "./date-picker"
import { DatePickerProps } from "./DatePicker"
import DatePickerInfo from "./DatePicker_Info"
import DatapickerCalendar from "./Datapicker_Calendar"
import { Modal } from "../../layout/modal/Modal"
import "./DatePicker.css"
import "./DatePickerModal.css"

const DatePickerModalComponent: React.FC<DatePickerInputProps> = ({
    placeholder = "",
    event,
    range,
    onChange,
    dateDefaultValues,
    label,
    errorHintText,
}) => {

    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
    const [dateSelect, setDateSelect] = useState<Date[]>(dateDefaultValues || [])
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
        <div
            className={cx({
                "datepicker-modal__input": true,
                "datepicker-modal__input--active": dateSelect.length > 0,
            })}
        >
            <DatePickerInfo
                setIsDatePickerOpen={setIsDatePickerOpen}
                isDatePickerOpen={isDatePickerOpen}
                errorHintText={errorHintText}
                placeholder={placeholder}
                currMonth={currMonth}
                currYear={currYear}
                monthShort={monthShort}
                dateSelect={dateSelect}
                label={label}
            />
            <Modal
                isOpen={isDatePickerOpen}
                width={490}
                height={600}
                className="datepicker-modal__modal"
                onClose={() => setIsDatePickerOpen(false)}
                isCancelableOnClickOutside={false}
            >
                <DatapickerCalendar
                    passSelect={true}
                    monthNames={monthNames}
                    isDatePickerOpen={isDatePickerOpen}
                    dateSelect={dateSelect}
                    range={range}
                    dateDefaultValues={dateDefaultValues}
                    onChange={onChange}
                    setDateSelect={setDateSelect}
                    setIsDatePickerOpen={setIsDatePickerOpen}
                    currMonth={currMonth}
                    setCurrMonth={setCurrMonth}
                    currYear={currYear}
                    setCurrYear={setCurrYear}
                    event={event}
                />
            </Modal>
        </div>
    )
}

const DatePickerModal: React.FC<DatePickerProps> = ({
    label,
    placeholder,
    range,
    event,
    onChange,
    dateDefaultValues,
    errorHintText,
}) => {
    return (
        <div className="input-container">
            {/* Etiqueta para el DatePicker */}
            {/* {label && <label className="input-container__label">{label}</label>} */}
            {/* Contenedor del DatePickerInput */}
            <div className="input-date datepicker-modal__input-date">
                {/* Renderiza el componente DatePickerInput pasando las propiedades requeridas */}
                <DatePickerModalComponent
                    placeholder={placeholder}
                    range={range}
                    event={event}
                    onChange={onChange}
                    dateDefaultValues={dateDefaultValues}
                    label={label}
                    errorHintText={errorHintText}
                />
            </div>
        </div>
    )
}

export default DatePickerModal
