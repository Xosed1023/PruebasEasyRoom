import { InputHTMLAttributes, LegacyRef } from "react"

export interface DatePickerInputProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "onChange"> {
    event?: Date[]
    date?: Date[]
    label?: string
    range?: boolean
    placeholder?: string
    passSelect?: boolean
    diffMonthDaysSelectable?: boolean
    errorHintText?: string
    dateDefaultValues?: Date[]
    value?: string[]
    setValue?: (value: Date[]) => void,
    iconMode?: boolean
    onChange: (value: Date[]) => void
    secondary?: boolean
}

export interface DatePickerProps extends InputHTMLAttributes<HTMLInputElement> {
    ref?: LegacyRef<HTMLInputElement>
    range: boolean
    label: string
    placeholder?: string
    iconMode?: boolean
    disabled?: boolean
    date?: Date[]
    event?: Date[]
}
export interface DatePickerInfoProps {
    setIsDatePickerOpen: React.Dispatch<React.SetStateAction<boolean>>
    isDatePickerOpen: boolean
    placeholder: string
    errorHintText?: string
    currMonth: number
    currYear: number
    className?: string,
    monthShort: string[]
    iconMode?: boolean
    label?: string
    dateSelect: Date[]
}
export interface DatapickerCalendarProps {
    setDateSelect: React.Dispatch<React.SetStateAction<Date[]>>
    setIsDatePickerOpen: React.Dispatch<React.SetStateAction<boolean>>
    setCurrMonth: React.Dispatch<React.SetStateAction<number>>
    setCurrYear: React.Dispatch<React.SetStateAction<number>>
    onChange: (value: Date[]) => void
    monthNames: string[]
    isDatePickerOpen: boolean
    diffMonthDaysSelectable?: boolean
    dateSelect: Date[]
    range?: boolean
    dateDefaultValues?: Date[]
    currMonth: number
    currYear: number
    setValue?: (value: Date[]) => void
    iconMode?: boolean
    event?: Date[]
    passSelect: boolean,
    secondary?: boolean
}
export const monthNames = [
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
export const monthShort = monthNames.map((month) => month.slice(0, 3))
