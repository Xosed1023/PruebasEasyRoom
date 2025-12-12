import React, { useState } from "react"
import { Modal } from "src/shared/components/layout/modal/Modal"

import "./InputDateModal.css"
import DatePaginator from "../../components/DatePaginator/DatePaginator"
import WeekDays from "../../components/WeekDays/WeekDays"
import MonthDays from "../../components/MonthDays/MonthDays"
import { Button } from "../../../button/Button"
import { getNextMonth, getNextYearByMonth, getPrevMonth, getPrevYearByMonth } from "../../components/MonthDays/helpers"
import { InputDateModalDeselectableProps } from "./InputDateModal.type"

const InputDateModalDeselectable = ({
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
    height = "570px",
    width = "494px",
    selectableOnDblClick,
    onChangeDblClick,
    maxDate,
    allowDateDeselect = false,
}: InputDateModalDeselectableProps) => {
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

    const [now] = useState(new Date())
    const isNextDisabled =
        maxDate &&
        (selectedYear > maxDate.getFullYear() ||
            (selectedYear === maxDate.getFullYear() && getNextMonth(selectedMonth) > maxDate.getMonth()))
    return (
        <Modal
            className={className}
            height={height}
            width={width}
            withCloseButton={true}
            isOpen={isOpen}
            isCancelableOnClickOutside={modalClosableOnClickOutside}
            onClose={onClose}
        >
            <div className="input-date-modal__container">
                <div className="input-date-modal__container_deselectable">
                    <DatePaginator
                        onNext={() => {
                            if (isNextDisabled) return
                            setSelectedMonth(getNextMonth(selectedMonth))
                            setSelectedYear(getNextYearByMonth({ year: selectedYear, month: selectedMonth }))
                        }}
                        onPrev={() => {
                            setSelectedMonth(getPrevMonth(selectedMonth))
                            setSelectedYear(getPrevYearByMonth({ year: selectedYear, month: selectedMonth }))
                        }}
                        month={selectedMonth}
                        year={selectedYear}
                        disableNext={isNextDisabled}
                    />
                    <WeekDays />
                    <MonthDays
                        month={selectedMonth}
                        year={selectedYear}
                        today={now}
                        onChange={(date) => {
                            if (!allowDateDeselect && date === null) {
                                return
                            }
                            onChange(date)
                        }}
                        isRange={isRange}
                        value={value}
                        onDblClick={(date) => {
                            selectableOnDblClick ? onChangeDblClick?.(date) : null
                        }}
                        disabledBeforeOrEqualDate={disabledBeforeOrEqualDate}
                        disabledAfterOrEqualDate={disabledAfterOrEqualDate}
                        allowDateDeselect={allowDateDeselect}
                    />
                    <div className="input-date-modal__footer">
                        <div className="input-date-modal__footer__divider"></div>
                        <div className="input-date-modal__footer__buttons">
                            <Button
                                theme="secondary"
                                text={value.length > 0 ? "Borrar filtro" : "Cancelar"}
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
            </div>
        </Modal>
    )
}

export default InputDateModalDeselectable
