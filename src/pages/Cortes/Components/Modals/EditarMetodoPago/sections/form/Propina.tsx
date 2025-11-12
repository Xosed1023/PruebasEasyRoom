import { useMemo, useState, useEffect, useImperativeHandle, forwardRef } from "react"
import { InputCurrency } from "src/shared/sections/payment/InputCurrency"
import { getCurrencyFormat } from "src/utils/string"

type TipOptionsProps = {
    defaultValue?: number
    currentValue: number
    options: number[]
    amount: number
    error?: boolean
    disabled?: boolean
    onChange: (value: number) => void
}

const Propina = forwardRef(
    (
        {
            amount = 0,
            options = [],
            error = false,
            disabled = false,
            onChange,
            defaultValue = 0,
            currentValue = 0,
        }: TipOptionsProps,
        ref
    ) => {
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

        useImperativeHandle(
            ref,
            () => {
                return {
                    handleKey: (v: string) => setKey(v),
                }
            },
            []
        )

        useEffect(() => {
            if (currentValue !== value) {
                setValue(currentValue)
            }
        }, [currentValue])

        useEffect(() => {
            if (defaultValue && typeof defaultValue === "number") {
                handleKey(defaultValue)
            }
        }, [defaultValue])

        const handleKey = (v: number) => {
            const find = tipOptions.find((item) => item.value === v)
            if (find && v > 0) {
                setKey(find?.label || "")
            } else {
                if (v > 0) {
                    setKey("Otro")
                } else {
                    setKey("")
                }
            }
        }

        const handleChange = (label: string, value: number) => {
            if (label === key) {
                setKey("")
                onChange(0)
            } else {
                setKey(label)
                onChange(label === "Otro" ? 0 : value)
            }
        }

        return (
            <div className="cortes__edicion-pago__propina__options">
                <div className="cortes__edicion-pago__propina__tabs">
                    {tipOptions.map(({ label = "", value = 0 }, index) => (
                        <div
                            key={index}
                            className={`cortes__edicion-pago__propina-item ${
                                key === label
                                    ? "cortes__edicion-pago__propina-item--active"
                                    : "cortes__edicion-pago__propina-item--default"
                            }`}
                            onClick={!disabled ? () => handleChange(label, value) : undefined}
                        >
                            <p className="cortes__edicion-pago__propina-item-title">{label}</p>
                            {value > 0 && (
                                <p className="cortes__edicion-pago__propina-item-label">{`(${getCurrencyFormat(
                                    value
                                )})`}</p>
                            )}
                        </div>
                    ))}
                </div>
                {key === "Otro" && (
                    <div className="cortes__edicion-pago__propina-input-currency">
                        <InputCurrency
                            error={error}
                            errorhinttext={error ? "Ingresa un monto" : ""}
                            label="Monto"
                            icon="dollarCircle"
                            value={value}
                            whiteSpace={true}
                            disabled={disabled}
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
)

export default Propina
