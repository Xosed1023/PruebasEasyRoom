import React, { useState } from "react"
import InputDateText from "./sections/InputDateText/InputDateText"
import InputDateModal from "./sections/InputDateModal/InputDateModal"

const InputDate = ({
    inputClassName,
    modalClassName,
    isRange = false,
    placeholder,
    label,
    onChange,
    onReset,
    value,
    errorHintText,
    disabledBeforeOrEqualDate,
    disabledAfterOrEqualDate,
    onChangeDblClick,
    modalClosableOnClickOutside = false,
    height = "65dvh",
    width = "494px",
    disabled = false,
    selectableOnDblClick = false
}: {
    inputClassName?: string
    modalClassName?: string
    // isRange hace que se pueda cerrar el modal al confirmar habiendo seleccionado solo una fecha
    isRange?: boolean
    placeholder?: string
    label?: string
    onChange: (value: Date) => void
    modalClosableOnClickOutside?: boolean
    onChangeDblClick?: (value: Date) => void
    onReset: () => void
    value: Date[]
    errorHintText?: string
    disabledBeforeOrEqualDate?: Date,
    disabledAfterOrEqualDate?: Date,
    height?: string
    width?: string
    disabled?: boolean
    selectableOnDblClick?: boolean
}) => {
    const [isPickDateModalOpen, setisPickDateModalOpen] = useState(false)

    return (
        <>
            <InputDateText
                onClick={() => setisPickDateModalOpen(true)}
                className={inputClassName}
                placeholder={placeholder}
                label={label}
                value={value}
                errorHintText={errorHintText}
                disabled={disabled}
            />
            <InputDateModal
                modalClosableOnClickOutside={modalClosableOnClickOutside}
                isOpen={isPickDateModalOpen}
                className={modalClassName}
                selectableOnDblClick={selectableOnDblClick}
                height={height}
                width={width}
                onClose={() => setisPickDateModalOpen(false)}
                disabledBeforeOrEqualDate={disabledBeforeOrEqualDate}
                disabledAfterOrEqualDate={disabledAfterOrEqualDate}
                onReset={() => {
                    onReset()
                }}
                onChangeDblClick={(date) => {
                    onChangeDblClick?.(date)
                    setisPickDateModalOpen(false)
                }}
                onConfirm={() => {
                    if(!value?.length || (value?.length < 2 && isRange)) {
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
        </>
    )
}

export default InputDate
