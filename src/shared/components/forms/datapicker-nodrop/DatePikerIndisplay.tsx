import { useRef, useState } from "react"
import "./DatePickerInDisplay.css"

import { DatePickerInDisplayInfo } from "./DatePickerInDispaly_Info"
import { DatapickerInDisplayCalendar } from "./DatapickerInDisplayCalendar"
import { DatePickerInDisplatProps } from "./datapicker-in-display.props"
import React from "react"

// Componente DatePickerComponent que contiene la estructura base del DatePicker
const DatePickerInDisplatComponent: React.FC<DatePickerInDisplatProps> = ({
    label,
    placeholder,
    ref,
    event,
    passSelect,
    onChange,
    errorhinttext,
    buttonConfirm,
    iconMode,
    buttonConfirmOnClick,
}) => {
    const [dateSelect, setDateSelect] = useState<Date[]>([])
    const [currMonth, setCurrMonth] = useState(new Date().getMonth())
    const [currYear, setCurrYear] = useState(new Date().getFullYear())

    const refDatePicker = useRef<HTMLInputElement>(null)

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
        <div className="datepicker-in-display-defaul" ref={refDatePicker}>
            {/* Etiqueta para el DatePicker */}
            <label className="datepicker-in-display-default__label">{label}</label>
            {/* Contenedor del DatePickerInput */}
            <div className="datepicker-in-display-default__input-container">
                <div style={{ width: "100%" }}>
                    <DatePickerInDisplayInfo
                        placeholder={placeholder}
                        currMonth={currMonth}
                        currYear={currYear}
                        monthShort={monthShort}
                        dateSelect={dateSelect}
                        errorhinttext={errorhinttext}
                    />
                    {errorhinttext && <span className={"input-text__hint--error"}>{errorhinttext}</span>}
                </div>
                <DatapickerInDisplayCalendar
                    passSelect={passSelect}
                    onChange={onChange}
                    monthNames={monthNames}
                    dateSelect={dateSelect}
                    setDateSelect={setDateSelect}
                    currMonth={currMonth}
                    setCurrMonth={setCurrMonth}
                    currYear={currYear}
                    setCurrYear={setCurrYear}
                    event={event}
                    buttonConfirm={buttonConfirm}
                    buttonConfirmOnClick={buttonConfirmOnClick}
                />
            </div>
        </div>
    )
}

// Componente DatePicker que se encargará de reenviar las referencias utilizando React.forwardRef
export const DatePickerInDisplat = React.forwardRef<HTMLInputElement, DatePickerInDisplatProps>((props, ref) => (
    // Renderiza el componente DatePickerComponent y pasa las props y la ref recibidas
    <DatePickerInDisplatComponent {...props} ref={ref} />
))
