import { useEffect, useMemo, useState } from "react"
import { InputCurrency } from "src/shared/sections/payment/InputCurrency"
import Icon from "src/shared/icons"
import { getCurrencyFormat } from "src/utils/string"
import "./TipOptions.css"

type TipOptionsProps = {
    options: number[]
    amount: number
    error?: boolean
    onChange: (value: number) => void
    onItemSelected: (value: boolean) => void
    modalExtra?: boolean
}

function TipOptions({
    amount = 0,
    options = [],
    error = false,
    onChange,
    onItemSelected,
    modalExtra = false,
}: TipOptionsProps): JSX.Element {
    const [value, setValue] = useState<number>(0)
    const [key, setKey] = useState<string>("")

    const tipOptions = useMemo(() => {
        const list = options.map((option) => {
            return {
                label: `${option}%`,
                value: Number(((option / 100) * amount).toFixed(2)),
            }
        })

        return [...list, { label: "Otro monto", value: 0 }]
    }, [options])

    useEffect(() => {
        if (modalExtra && key && key !== "Otro monto") {
            const porcentaje = Number(key.replace("%", ""))
            const nuevoValor = Number(((porcentaje / 100) * amount).toFixed(2))
            setValue(nuevoValor)
            onChange(nuevoValor)
        }
    }, [amount])

    const handleChange = (label: string, value: number) => {
        if (label === key) {
            setKey("")
            onItemSelected(false)
            onChange(0)
        } else {
            setKey(label)
            onItemSelected(true)
            onChange(value)
        }
    }

    return (
        <div className="tip__component">
            <div className="tip__component-options">
                {tipOptions.map(({ label = "", value = 0 }, index) => (
                    <div
                        key={index}
                        className={`tip__component-item ${
                            key === label ? "tip__component-item--active" : "tip__component-item--default"
                        }`}
                        onClick={() => handleChange(label, value)}
                    >
                        {value > 0 ? (
                            <p className="tip__component-item-title">{label}</p>
                        ) : (
                            <Icon
                                name="dollarCircle"
                                height={20}
                                width={20}
                                style={{ marginBottom: 10 }}
                                color={key === label ? "var(--primary)" : "var(--header)"}
                            />
                        )}
                        <p className="tip__component-item-label">{value > 0 ? getCurrencyFormat(value) : label}</p>
                    </div>
                ))}
            </div>
            {key === "Otro monto" && (
                <div className="tip__component-input-currency">
                    <InputCurrency
                        error={error}
                        errorhinttext={error ? "Ingresa un monto" : ""}
                        label="Monto de propina"
                        icon="dollarCircle"
                        value={value}
                        whiteSpace={true}
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

export default TipOptions