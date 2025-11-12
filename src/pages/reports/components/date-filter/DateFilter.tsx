import React, { useEffect, useState } from "react"
import { ButtonIcon } from "src/shared/components/forms/button-icon/ButtonIcon"
import InputDateModal from "src/shared/components/forms/input-date/sections/InputDateModal/InputDateModal"
import { useDate } from "src/shared/hooks/useDate"

const DateFilter = ({ onChange }: { onChange: (value: Date[]) => void }) => {
    const { areSameDay, setHHMMSS } = useDate()
    const [visible, setVisible] = useState<boolean>(false)
    const [value, setValue] = useState<Date[]>([])

    useEffect(() => {
        setInitialState()
    }, [])

    const setInitialState = () => {
        const baseDate = new Date()
        const baseStartDate = setHHMMSS({
            startDate: baseDate,
            newHour: "00:00:00.000",
            isNewHourInUTC: false,
        })
        const baseEndDate = setHHMMSS({
            startDate: baseDate,
            newHour: "23:59:59.999",
            isNewHourInUTC: false,
        })
        onChange([baseStartDate, baseEndDate])
        setValue([baseStartDate])
    }

    return (
        <>
            <InputDateModal
                isOpen={visible}
                height={"65dvh"}
                width={"494px"}
                onClose={() => {
                    setVisible(false)
                }}
                disabledAfterOrEqualDate={new Date()}
                onConfirm={() => {
                    if (!value?.length || value?.length < 1) {
                        return
                    }
                    if (value.length === 1) {
                        onChange([
                            value[0],
                            setHHMMSS({
                                startDate: value[0],
                                newHour: "23:59:59.999",
                                isNewHourInUTC: false,
                            }),
                        ])
                        setVisible(false)
                        return
                    }
                    onChange(value)
                    setVisible(false)
                }}
                onReset={() => setInitialState()}
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
                    setValue([
                        value[0],
                        setHHMMSS({
                            startDate: date,
                            newHour: "23:59:59.999",
                            isNewHourInUTC: false,
                        }),
                    ])
                }}
                value={value}
            />
            <ButtonIcon
                width="58px"
                type="button"
                theme={"secondary"}
                onClick={() => setVisible(true)}
                iconName="calendar"
            />
        </>
    )
}

export default DateFilter
