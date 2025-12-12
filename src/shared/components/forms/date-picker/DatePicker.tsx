import React, { Fragment, useEffect, useState } from "react"
import InputDateText from "../input-date/sections/InputDateText/InputDateText"
import InputDateModal from "../input-date/sections/InputDateModal/InputDateModal"
import DatePaginator from "../input-date/components/DatePaginator/DatePaginator"
import {
    getNextMonth,
    getNextYearByMonth,
    getPrevMonth,
    getPrevYearByMonth,
} from "../input-date/components/MonthDays/helpers"
import WeekDays from "../input-date/components/WeekDays/WeekDays"
import MonthDays from "../input-date/components/MonthDays/MonthDays"
import Skeleton from "../../layout/skeleton/Skeleton"
import "./DatePickerStyles.css"
import { useCurrentDateQuery } from "src/gql/schema"
import { useDate } from "src/shared/hooks/useDate"

const DatePicker = ({
    inputClassName,
    isRange = false,
    placeholder,
    label,
    onChange,
    onReset,
    value,
    errorHintText,
    disabledBeforeOrEqualDate,
    disabledAfterOrEqualDate,
    loading = false,
}: {
    inputClassName?: string
    isRange?: boolean
    placeholder?: string
    label?: string
    onChange: (value: Date) => void
    onReset: () => void
    value: Date[]
    errorHintText?: string
    disabledBeforeOrEqualDate?: Date
    disabledAfterOrEqualDate?: Date
    loading?: boolean
}) => {
    const [isPickDateModalOpen, setisPickDateModalOpen] = useState(false)
    const { data } = useCurrentDateQuery()
    const { UTCStringToLocalDate } = useDate()

    const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth())
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())

    useEffect(() => {
        setSelectedMonth(UTCStringToLocalDate(data?.serverDate).getMonth())
        setSelectedYear(UTCStringToLocalDate(data?.serverDate).getFullYear())
    }, [data])

    return (
        <>
            <InputDateText
                onClick={() => null}
                className={`date-picker-container ${inputClassName}`}
                placeholder={placeholder}
                label={label}
                value={value}
                errorHintText={errorHintText}
                readOnlyValue={true}
            />
            <InputDateModal
                isOpen={isPickDateModalOpen}
                onClose={() => setisPickDateModalOpen(false)}
                disabledBeforeOrEqualDate={disabledBeforeOrEqualDate}
                disabledAfterOrEqualDate={disabledAfterOrEqualDate}
                onReset={() => {
                    onReset()
                }}
                onConfirm={() => {
                    if (!value?.length || (value?.length < 2 && isRange)) {
                        return
                    }
                    setisPickDateModalOpen(false)
                }}
                isRange={isRange}
                onChange={(date) => {
                    onChange?.(date)
                }}
                value={value}
            />
            <div className="input-date-modal__container date-picker-calender">
                {!loading ? (
                    <Fragment>
                        <DatePaginator
                            onNext={() => {
                                setSelectedMonth(getNextMonth(selectedMonth))
                                setSelectedYear(getNextYearByMonth({ year: selectedYear, month: selectedMonth }))
                            }}
                            onPrev={() => {
                                setSelectedMonth(getPrevMonth(selectedMonth))
                                setSelectedYear(getPrevYearByMonth({ year: selectedYear, month: selectedMonth }))
                            }}
                            month={selectedMonth}
                            year={selectedYear}
                            primarySize={33}
                        />
                        <WeekDays />
                        <MonthDays
                            month={selectedMonth}
                            year={selectedYear}
                            today={UTCStringToLocalDate(data?.serverDate)}
                            onChange={(date) => {
                                if (date !== null) {
                                    onChange(date)
                                }
                            }}
                            isRange={isRange}
                            value={value}
                            disabledBeforeOrEqualDate={disabledBeforeOrEqualDate}
                            disabledAfterOrEqualDate={disabledAfterOrEqualDate}
                        />
                    </Fragment>
                ) : (
                    <div className="date-picker-calender__skeleton">
                        <div className="date-picker-calender__skeleton-head">
                            <Skeleton.Item className="date-picker-calender__skeleton-circle" />
                            <Skeleton.Item className="date-picker-calender__skeleton-title" />
                            <Skeleton.Item className="date-picker-calender__skeleton-circle" />
                        </div>
                        <Skeleton className="date-picker-calender__skeleton-content" elements={7} />
                    </div>
                )}
            </div>
        </>
    )
}

export default DatePicker
