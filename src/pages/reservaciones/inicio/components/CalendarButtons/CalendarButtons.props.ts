import { ComponentProps } from "src/types/component"

export interface CalendarButtonsProps extends ComponentProps {
    currDay?: number
    setCurrDay?: any
    currMonth: number
    setCurrMonth: any
    currYear: number
    setCurrYear: any
    monthNames: (string | number)[]
}
