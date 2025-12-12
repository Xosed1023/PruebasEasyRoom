import React, { useState } from "react"
import { Modal } from "src/shared/components/layout/modal/Modal"

import "./InputDateModal.css"
import DatePaginator from "../../components/DatePaginator/DatePaginator"
import WeekDays from "../../components/WeekDays/WeekDays"
import MonthDays from "../../components/MonthDays/MonthDays"
import { Button } from "../../../button/Button"
import { getNextMonth, getNextYearByMonth, getPrevMonth, getPrevYearByMonth } from "../../components/MonthDays/helpers"
import { InputDateModalProps } from "./InputDateModal.type"

const InputDateModal = ({
    isOpen,
    onClose,
    isRange,
    onChange,
    value,
    onReset,
    onConfirm,
    disabledBeforeOrEqualDate,
    disabledAfterOrEqualDate,
    modalClosableOnClickOutside,
    className,
    height = "65dvh",
    width = "494px",
    selectableOnDblClick,
    onChangeDblClick,
}: InputDateModalProps) => {
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

    const [now] = useState(new Date())

    return (
        <Modal
            className={className}
            height={height}
            width={width}
            isOpen={isOpen}
            isCancelableOnClickOutside={modalClosableOnClickOutside}
            onClose={onClose}
        >
            <div className="input-date-modal__container">
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
                />
                <WeekDays />
                <MonthDays
                    month={selectedMonth}
                    year={selectedYear}
                    today={now}
                    onChange={(date) => {
                        if (date !== null) {
                            onChange(date)
                        }
                    }}
                    isRange={isRange}
                    value={value}
                    onDblClick={(date) => {
                        selectableOnDblClick ? onChangeDblClick?.(date) : null
                    }}
                    disabledBeforeOrEqualDate={disabledBeforeOrEqualDate}
                    disabledAfterOrEqualDate={disabledAfterOrEqualDate}
                />
                <div className="input-date-modal__footer">
                    <div className="input-date-modal__footer__divider"></div>
                    <div className="input-date-modal__footer__buttons">
                        <Button
                            theme="secondary"
                            text="Cancelar"
                            className="input-date-modal__footer__button"
                            type="button"
                            onClick={() => {
                                onReset()
                                onClose()
                            }}
                        />
                        <Button
                            theme="primary"
                            text="Seleccionar"
                            className="input-date-modal__footer__button"
                            type="button"
                            onClick={() => onConfirm()}
                        />
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default InputDateModal
