import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDate } from "src/shared/hooks/useDate"
import InputDateModal from "src/shared/components/forms/input-date/sections/InputDateModal/InputDateModal"
import Selector from "src/shared/components/forms/Selector/Selector"

type Param = {
    fecha_final: string
    fecha_inicial: string
}

type HistorialSelectorProps = {
    onDateChange: (param: Param) => void
}

const options = [
    { label: "Propinas acumuladas", value: "acumuladas" },
    { label: "Propinas pagadas", value: "pagadas" },
]

const HistorialSelector = ({ onDateChange }: HistorialSelectorProps) => {
    const { areSameDay } = useDate()
    const [selectorValue, setselectorValue] = useState("")
    const [value, setValue] = useState<Date[]>([])

    const navigate = useNavigate()

    const onFieldChange = (date: Date[]) => {
        if (date.length === 2) {
            onDateChange({
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
            onDateChange({
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
            onDateChange({ fecha_inicial: "", fecha_final: "" })
        }
    }

    return (
        <>
            <InputDateModal
                modalClosableOnClickOutside={false}
                isOpen={selectorValue === options?.[0]?.value}
                disabledAfterOrEqualDate={new Date()}
                selectableOnDblClick={false}
                onClose={() => setselectorValue("")}
                onReset={() => {
                    setValue([])
                    onFieldChange([])
                }}
                onConfirm={() => {
                    if (value.length === 0) {
                        return
                    }
                    setselectorValue("")
                    onFieldChange(value)
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
            <Selector<string>
                title={"Historial"}
                value={selectorValue}
                icon="calendarFill"
                onChange={(v) => {
                    if (options?.[1]?.value === v) navigate("/u/propinas/historial-pagos")
                    setselectorValue(v)
                }}
                options={options}
            />
        </>
    )
}

export default HistorialSelector
