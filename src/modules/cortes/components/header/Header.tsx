import ArrowLeft from "@/icons/ArrowLeft"
import Calendar from "@/icons/Calendar"

import styles from "./Header.module.css"
import { useNavigate } from "react-router"
import DatePickerSheet from "@/components/core/forms/date-picker-sheet/DatePickerSheet"
import { useEffect, useState } from "react"
import DatePickerHeaderGeneral from "@/components/core/forms/date-picker-sheet/sections/DatePickerHeaderGeneral/DatePickerHeaderGeneral"
import DatePickerHeader from "../../pages/components/date-picker-header/DatePickerHeader"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const Header = ({
    title,
    onSelectDate,
    withCalendar = true,
    withDayPicker = true,
    isRange = false,
    onDatesRangeChange,
    startDatesRangeValue
}: {
    title: string
    onSelectDate?: (date: Date) => void
    withCalendar?: boolean
    withDayPicker?: boolean
    isRange?: boolean
    onDatesRangeChange?: (d: Date[]) => void
    startDatesRangeValue?: Date[]
}) => {
    const navigate = useNavigate()

    const [calendarOpen, setcalendarOpen] = useState(false)
    const [drawerState, setdrawerState] = useState<"start" | "end" | "close">("close")
    const [dates, setdates] = useState<Date[]>([])

    useEffect(() => {
        setdates(startDatesRangeValue || [])
        console.log(dates)
    }, [startDatesRangeValue])
    

    return (
        <div className="flex justify-between items-center h-full s:px-[35px] xs:px-[20px]">
            <div className="flex gap-x-[20px] items-center">
                <ArrowLeft onClick={() => navigate(-1)} />
                <span className={`${styles.corte__header__title} s:text-[24px] xs:text-[18px]`}>{title}</span>
            </div>
            {withCalendar && !isRange && (
                <>
                    <DatePickerSheet
                        header={(onAccept) => (
                            <DatePickerHeaderGeneral
                                handleAccept={() => {
                                    onAccept()
                                    setcalendarOpen(false)
                                }}
                                headerRight="Aceptar"
                            />
                        )}
                        onClose={() => setcalendarOpen(false)}
                        onSelectDate={(d) => onSelectDate?.(d)}
                        open={calendarOpen}
                        withDays={withDayPicker}
                    />
                    <Calendar onClick={() => setcalendarOpen(true)} width={24} height={24} />
                </>
            )}
            {withCalendar && isRange &&
                <>
                    <DatePickerSheet
                        header={(onAccept) => (
                            <DatePickerHeader
                                title="Fecha de inicio"
                                next={
                                    <div
                                        className="flex flex-1 justify-end items-center"
                                        onClick={() => {
                                            onAccept()
                                            setdrawerState("end")
                                        }}
                                    >
                                        <ChevronRight color="var(--primary)" />
                                    </div>
                                }
                            />
                        )}
                        onClose={() => {
                            setdrawerState("close")
                            setdates([])
                            onDatesRangeChange?.([])
                        }}
                        onSelectDate={(d) => {
                            setdates([d])
                        }}
                        open={drawerState === "start"}
                        withDays={true}
                    />
                    <DatePickerSheet
                        header={(onAccept) => (
                            <DatePickerHeader
                                title="Fecha de término"
                                next={
                                    <div
                                        className={cn("flex flex-1 justify-end items-center")}
                                        onClick={() => {
                                            onAccept()
                                            setdrawerState("close")
                                        }}
                                    >
                                        <button className={styles["range-filter__confirm"]}>Aceptar</button>
                                    </div>
                                }
                                back={
                                    <div
                                        className="flex flex-1 justify-start items-center"
                                        onClick={() => {
                                            setdrawerState("start")
                                        }}
                                    >
                                        <ChevronLeft color="var(--primary)" />
                                    </div>
                                }
                            />
                        )}
                        onClose={() => {
                            setdrawerState("close")
                            setdates([])
                        }}
                        onSelectDate={(d) => setdates((v) => {
                            onDatesRangeChange?.([...v, d])
                            return [...v, d]
                        })}
                        open={drawerState === "end"}
                        withDays={true}
                    />
                    <Calendar onClick={() => setdrawerState("start")} width={24} height={24} />
                </>
            }
        </div>
    )
}

export default Header
