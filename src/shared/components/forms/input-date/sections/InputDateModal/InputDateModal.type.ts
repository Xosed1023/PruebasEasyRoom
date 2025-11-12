export type InputDateModalCommonProps = {
    isOpen: boolean
    onClose: () => void
    isRange: boolean
    value: Date[]
    onReset: () => void
    onConfirm: () => void
    disabledBeforeOrEqualDate?: Date
    disabledAfterOrEqualDate?: Date
    modalClosableOnClickOutside?: boolean
    className?: string
    height?: string
    width?: string
    selectableOnDblClick?: boolean
    onChangeDblClick?: (date: Date) => void
}

export type InputDateModalProps = InputDateModalCommonProps & {
    onChange: (date: Date) => void
}

export type InputDateModalDeselectableProps = InputDateModalCommonProps & {
    onChange: (date: Date | null) => void
    maxDate?: Date
    allowDateDeselect?: boolean
}
