import { useMemo, useState, useEffect } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { InputCurrency } from "src/shared/sections/payment/InputCurrency"
import { getCurrencyFormat } from "src/utils/string"

type TipOptionsProps = {
    defaultValue?: number
    options: number[]
    amount: number
    error?: boolean
    onChange: (value: number) => void
    onItemSelected: (value: boolean) => void
}

export const TipOptions = ({
    amount = 0,
    options = [],
    error = false,
    onChange,
    onItemSelected,
    defaultValue = 0,
}: TipOptionsProps) => {
    const [value, setValue] = useState<number>(0)
    const [key, setKey] = useState<string>("")

    const tipOptions = useMemo(() => {
        const list = options.map((option) => {
            return {
                label: `${option}%`,
                value: Number(((option / 100) * amount).toFixed(2)),
            }
        })

        return [...list, { label: "Otro", value: 0 }]
    }, [options])

    useEffect(() => {
        if (typeof defaultValue === "number" && defaultValue !== value) {
            const find = tipOptions.find((item) => item.value === defaultValue)
            if (find) {
                setValue(defaultValue)
                setKey(find?.label || "")
            } else {
                setValue(defaultValue)
                setKey("Otro")
            }
        }
    }, [defaultValue])

    const handleChange = (label: string, value: number) => {
        if (label === key) {
            setKey("")
            onItemSelected(false)
            onChange(-1)
        } else {
            setKey(label)
            onItemSelected(true)
            onChange(value)
        }
    }

    return (
        <div className="modal-mixto__tip__options">
            <div className="modal-mixto__tip__tabs">
                {tipOptions.map(({ label = "", value = 0 }, index) => (
                    <div
                        key={index}
                        className={`modal-mixto__tip-item ${
                            key === label ? "modal-mixto__tip-item--active" : "modal-mixto__tip-item--default"
                        }`}
                        onClick={() => handleChange(label, value)}
                    >
                        <p className="modal-mixto__tip-item-title">{label}</p>
                        {value > 0 && <p className="modal-mixto__tip-item-label">{`(${getCurrencyFormat(value)})`}</p>}
                    </div>
                ))}
            </div>
            {key === "Otro" && (
                <div className="modal-mixto__tip-input-currency">
                    <InputCurrency
                        error={error}
                        errorhinttext={error ? "Ingresa un monto" : ""}
                        label="Monto"
                        icon="dollarCircle"
                        value={value}
                        onChange={(value) => {
                            setValue(value)
                            onChange(value)
                        }}
                    />
                </div>
            )}
        </div>
    )
}

export function TipSection({ amount = 0, index = 0 }): JSX.Element {
    const [required, setRequired] = useState<boolean>(false)
    const { control, getValues, setValue } = useFormContext()

    return (
        <Controller
            rules={{ required, validate: required ? (item) => item?.value > 0 : undefined }}
            control={control}
            name={`propinas.${index}`}
            render={({ field: { onChange, value }, fieldState: { error } }) => {
                return (
                    <TipOptions
                        error={!!error}
                        options={[10, 15]}
                        amount={amount || 0}
                        onChange={(value) => {
                            if (value > 0) {
                                onChange({ id: `${index}`, value })
                            } else if (value < 0) {
                                const propinas: any[] = getValues("propinas") || []
                                setValue(
                                    "propinas",
                                    propinas.filter((item) => item?.id !== `${index}`)
                                )
                            } else {
                                onChange({ id: `${index}`, value: 0 })
                            }
                        }}
                        onItemSelected={(value) => {
                            setRequired(value)
                        }}
                        defaultValue={value?.value || 0}
                    />
                )
            }}
        />
    )
}