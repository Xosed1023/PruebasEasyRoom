import { InputHTMLAttributes, LegacyRef } from "react"

export interface DatePickerInDisplatProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "onChange"> {
    ref?: LegacyRef<HTMLInputElement>
    label: string
    placeholder: string
    disabled?: boolean
    event?: Date[]
    passSelect?: boolean
    errorhinttext?: string
    onChange?: (value: Date[]) => void
    buttonConfirm?: boolean
    iconMode?: boolean
    buttonConfirmOnClick?: () => void
}
export interface DatePickerInDisplayInfoProps {
    placeholder: string
    currMonth: number
    currYear: number
    monthShort: string[]
    errorhinttext?: string
    iconMode?: boolean
    dateSelect: Date[]
}
export interface DatapickerInDisplayCalendarProps {
    passSelect?: boolean
    monthNames: string[]
    dateSelect: Date[]
    setDateSelect: React.Dispatch<React.SetStateAction<Date[]>>
    currMonth: number
    setCurrMonth: React.Dispatch<React.SetStateAction<number>>
    currYear: number
    setCurrYear: React.Dispatch<React.SetStateAction<number>>
    event?: Date[]
    onChange?: (value: Date[]) => void
    buttonConfirm?: boolean
    buttonConfirmOnClick?: () => void
}
