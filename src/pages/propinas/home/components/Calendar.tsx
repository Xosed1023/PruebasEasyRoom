import { Fragment, useState } from "react"
import cx from "classnames"
import Icon from "src/shared/icons/calendarEvent"
import InputDateModal from "src/shared/components/forms/input-date/sections/InputDateModal/InputDateModal"
import { useDate } from "src/shared/hooks/useDate"

type Param = {
    fecha_final: string
    fecha_inicial: string
}

type CalendarButtonProps = {
    onChange: (param: Param) => void
}

function CalendarButton({ onChange }: CalendarButtonProps): JSX.Element {
    const [visible, setVisible] = useState<boolean>(false)
    const [value, setValue] = useState<Date[]>([])

    const { areSameDay } = useDate()

    const onFieldChange = (date: Date[]) => {
        if (date.length === 2) {
            onChange({
                fecha_inicial: date[0].toISOString(),
                fecha_final: new Date(
                    date[1].getFullYear(),
                    date[1].getMonth(),
                    date[1].getDate(),
                    23,
                    59,
                    59,
                    59
                ).toISOString(),
            })
        } else if (date.length === 1) {
            onChange({
                fecha_inicial: date[0].toISOString(),
                fecha_final: new Date(
                    date[0].getFullYear(),
                    date[0].getMonth(),
                    date[0].getDate(),
                    23,
                    59,
                    59,
                    59
                ).toISOString(),
            })
        } else {
            onChange({ fecha_inicial: "", fecha_final: "" })
        }
    }

    return (
        <Fragment>
            <div
                className={cx({
                    "propinas-h__top-btn": true,
                    "propinas-h__top-btn--active": value.length > 0,
                })}
                onClick={() => setVisible(true)}
            >
                <Icon height={20} width={20} color={value.length === 0 ? "var(--header)" : "var(--primary)"} />
            </div>
            <InputDateModal
                modalClosableOnClickOutside={false}
                isOpen={visible}
                selectableOnDblClick={false}
                onClose={() => setVisible(false)}
                onReset={() => {
                    setValue([])
                    onFieldChange([])
                }}
                onConfirm={() => {
                    if (!value?.length) {
                        return
                    }
                    onFieldChange(value)
                    setVisible(false)
                }}
                isRange={true}
                onChange={(date) => {
                    if (value.length === 0 || date <= value[0]) {
                        setValue([date])
                        return
                    }
                    if (value?.length === 2 && areSameDay(new Date(), date)) {
                        setValue([date])
                        return
                    }
                    if (value?.length === 2) {
                        setValue([])
                        return
                    }
                    setValue([value[0], date])
                }}
                value={value}
            />
        </Fragment>
    )
}

export default CalendarButton
