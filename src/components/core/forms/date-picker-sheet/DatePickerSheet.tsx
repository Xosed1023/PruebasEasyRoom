import { useState, useEffect, useRef, ReactNode } from "react"
import cx from "classnames"
import { Sheet, SheetContent } from "@/components/ui/sheet/Sheet"
import styles from "./DatePickerSheet.module.css"
import { MONTH_NAMES } from "@/utils/month-names"

type DatePickerSheetProps = {
    open: boolean
    onClose: () => void
    onSelectDate: (date: Date) => void
    header?: (handleAccept: () => void) => ReactNode
    withDays?: boolean
    headerLeft?: string
}

const DatePickerSheet = ({ open, onClose, onSelectDate, header, withDays = true }: DatePickerSheetProps) => {
    const today = new Date()
    const currentYear = today.getFullYear()
    const currentMonth = today.getMonth()
    const currentDay = today.getDate()

    const [selectedDay, setSelectedDay] = useState(currentDay)
    const [selectedMonth, setSelectedMonth] = useState(currentMonth)
    const [selectedYear, setSelectedYear] = useState(currentYear)

    const years = Array.from({ length: currentYear - 2020 + 1 }, (_, i) => 2020 + i)

    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate()
    }

    const validDays = (() => {
        const maxDay = getDaysInMonth(selectedYear, selectedMonth)
        if (selectedYear === currentYear && selectedMonth === currentMonth) {
            return Array.from({ length: currentDay }, (_, i) => i + 1)
        }
        return Array.from({ length: maxDay }, (_, i) => i + 1)
    })()

    const validMonths = (() => {
        if (selectedYear === currentYear) {
            return MONTH_NAMES.slice(0, currentMonth + 1)
        }
        return MONTH_NAMES
    })()

    const dayRef = useRef<HTMLUListElement>(null)
    const monthRef = useRef<HTMLUListElement>(null)
    const yearRef = useRef<HTMLUListElement>(null)

    const scrollToSelected = (ref: React.RefObject<HTMLUListElement | null>, index: number) => {
        const element = ref.current
        if (element) {
            const item = element.children[index] as HTMLElement
            item?.scrollIntoView({ behavior: "smooth", block: "center" })
        }
    }

    useEffect(() => {
        if (open) {
            setTimeout(() => {
                scrollToSelected(dayRef, validDays.indexOf(selectedDay))
                scrollToSelected(monthRef, validMonths.indexOf(MONTH_NAMES[selectedMonth]))
                scrollToSelected(yearRef, years.indexOf(selectedYear))
            }, 0)
        }
    }, [open, selectedDay, selectedMonth, selectedYear])

    const handleAccept = () => {
        const selectedDate = new Date(selectedYear, selectedMonth, withDays ? selectedDay : 1)
        onSelectDate(selectedDate)
    }

    return (
        <Sheet open={open} onOpenChange={onClose}>
            <SheetContent side="bottom" className={styles["datepicker-sheet"]}>
                {header?.(handleAccept)}

                <div className={styles["datepicker-sheet__scrolls"]}>
                    <ul ref={dayRef} className={styles["datepicker-sheet__column"]}>
                        {withDays &&
                            validDays.map((day, i) => (
                                <li
                                    key={day}
                                    className={cx(
                                        styles["datepicker-sheet__item"],
                                        day === selectedDay && styles["active"],
                                        Math.abs(i - validDays.indexOf(selectedDay)) === 1 && styles["semi-active"],
                                        Math.abs(i - validDays.indexOf(selectedDay)) >= 2 && styles["inactive"]
                                    )}
                                    onClick={() => setSelectedDay(day)}
                                >
                                    {day}
                                </li>
                            ))}
                    </ul>
                    <ul ref={monthRef} className={styles["datepicker-sheet__column"]}>
                        {validMonths.map((month) => {
                            const realIndex = MONTH_NAMES.indexOf(month)
                            return (
                                <li
                                    key={month}
                                    className={cx(
                                        styles["datepicker-sheet__item"],
                                        realIndex === selectedMonth && styles["active"],
                                        Math.abs(realIndex - selectedMonth) === 1 && styles["semi-active"],
                                        Math.abs(realIndex - selectedMonth) >= 2 && styles["inactive"]
                                    )}
                                    onClick={() => setSelectedMonth(realIndex)}
                                >
                                    {month}
                                </li>
                            )
                        })}
                    </ul>
                    <ul ref={yearRef} className={`${styles["datepicker-sheet__column"]}`}>
                        {years.map((year, i) => (
                            <li
                                key={year}
                                className={cx(
                                    styles["datepicker-sheet__item"],
                                    year === selectedYear && styles["active"],
                                    Math.abs(i - years.indexOf(selectedYear)) === 1 && styles["semi-active"],
                                    Math.abs(i - years.indexOf(selectedYear)) >= 2 && styles["inactive"]
                                )}
                                onClick={() => setSelectedYear(year)}
                            >
                                {year}
                            </li>
                        ))}
                    </ul>
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default DatePickerSheet
