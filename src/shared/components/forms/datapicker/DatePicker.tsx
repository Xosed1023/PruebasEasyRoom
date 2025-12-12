import React, { InputHTMLAttributes, LegacyRef, useEffect, useState } from "react"
import "./DatePicker.css"

import DatePickerInput from "./DatePicker_Input"

export interface DatePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "onChange"> {
    ref?: LegacyRef<HTMLInputElement>
    range: boolean
    label?: string
    placeholder?: string
    disabled?: boolean
    event?: Date[]
    value?: Date[]
    diffMonthDaysSelectable?: boolean
    passSelect?: boolean
    errorHintText?: string
    dateDefaultValues?: Date[]
    iconMode?: boolean
    chenngeValue?: Date[]
    onChange: (value: Date[]) => void
    secondary?: boolean
}

// Componente DatePickerComponent que contiene la estructura base del DatePicker
const DatePickerComponent: React.FC<DatePickerProps> = ({
    passSelect,
    label,
    value,
    placeholder,
    ref,
    range,
    event,
    iconMode,
    errorHintText,
    diffMonthDaysSelectable = false,
    chenngeValue = [],
    onChange,
    className,
    secondary,
}) => {
    const [chenngeValues, setChengeValue] = useState<Date[]>(value || [])

    useEffect(() => {
        if((value?.length || 0) > 1) {
            setChengeValue([value?.[0] || new Date(), value?.[1] || new Date()])
            return
        }
        setChengeValue(value?.length ? [value?.[0] || new Date()] : [])
    }, [value])

    return (
        <div
            className={`${
                iconMode ? "input-container-iconMode" : secondary ? "input-container-secondary" : "input-container"
            }`}
            ref={ref}
        >
            <DatePickerInput
                value={chenngeValues.map(v => v.toISOString())}
                secondary={secondary}
                placeholder={placeholder}
                diffMonthDaysSelectable={diffMonthDaysSelectable}
                range={range}
                event={event}
                className={className}
                errorHintText={errorHintText}
                onChange={onChange}
            />
        </div>
    )
}

// Componente DatePicker que se encargará de reenviar las referencias utilizando React.forwardRef
export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>((props, ref) => (
    // Renderiza el componente DatePickerComponent y pasa las props y la ref recibidas
    <DatePickerComponent {...props} ref={ref} />
))
