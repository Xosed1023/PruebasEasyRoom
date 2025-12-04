"use client"

import * as React from "react"
import { getMonth, getYear, setMonth, setYear } from "date-fns"
import { Calendar } from "@/components/ui/calendar/Calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover/Popover"
import { es } from "date-fns/locale"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select/Select"

interface DatePickerProps {
    startYear?: number
    endYear?: number
    children?: React.ReactNode
    onChange?: (date: Date) => void
    showCalendar?: boolean
}

export function DatePicker({
    startYear = getYear(new Date()) - 100,
    endYear = getYear(new Date()),
    children,
    onChange,
    showCalendar = true
}: DatePickerProps) {
    const [date, setDate] = React.useState<Date>(new Date())
    const months = [
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

    const years = React.useMemo(() => Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i), [])

    const handleMonthChange = (month: string) => {
        const newDate = setMonth(date, months.indexOf(month))
        setDate(newDate)
    }

    const handleYearChange = (year: string) => {
        const newDate = setYear(date, parseInt(year))
        setDate(newDate)
    }

    const handleSelect = (selectedDate: Date | undefined) => {
        if (selectedDate) {
            setDate(selectedDate)
        }
    }

    React.useEffect(() => {
        onChange?.(date)
    }, [date])

    return (
        <Popover>
            <PopoverTrigger asChild>
                {/* <Button
                    variant={"outline"}
                    className={cn("w-[280px] justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                    <CalendarIcon />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button> */}
                {children}
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <div className="flex justify-between p-2">
                    <Select onValueChange={handleMonthChange} value={months[getMonth(date)]}>
                        <SelectTrigger className="w-[110px]">
                            <SelectValue placeholder="Mes" />
                        </SelectTrigger>
                        <SelectContent>
                            {months.map((month) => (
                                <SelectItem key={month} value={month}>
                                    {month}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select onValueChange={handleYearChange} value={getYear(date).toString()}>
                        <SelectTrigger className="w-[110px]">
                            <SelectValue placeholder="Año" />
                        </SelectTrigger>
                        <SelectContent className="h-[300px]">
                            {years.map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                    {year}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                {showCalendar && 
                <Calendar
                    mode="single"
                    locale={es}
                    selected={date}
                    onSelect={handleSelect}
                    initialFocus
                    month={date}
                    onMonthChange={setDate}
                />
                }
            </PopoverContent>
        </Popover>
    )
}
