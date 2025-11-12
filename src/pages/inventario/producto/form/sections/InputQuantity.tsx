import { useRef, useState } from "react"
import { InputNumber } from "./InputNumber"
import { useEffectMouseDown } from "src/shared/hooks/handle-mousedown"
import ChevronUp from "src/shared/icons/ChevronUp"
import { unitOptions as options } from "./../Form.constants"

type InputQuantityProps = {
    value: string
    unit: string
    onChange: (value: string, unit: string) => void
    error: boolean
}

export const InputQuantity = ({ value = "", onChange, error = false, unit = "" }: InputQuantityProps) => {
    const ref = useRef<HTMLDivElement>(null)
    const [visible, setVisible] = useState<boolean>(false)

    useEffectMouseDown(ref, () => setVisible(false))

    return (
        <div className="product-form__input-quality">
            <InputNumber
                value={value}
                label={"Contenido neto"}
                placeholder={"Escribe una cantidad"}
                type={"text"}
                onChange={(value) => onChange(value, unit)}
                error={error}
                errorhinttext={"Escribe el contenido neto del producto"}
            />
            <div className="product-form__input-quality__float">
                <div className="product-form__input-quality__box" onClick={() => setVisible(true)}>
                    <p className="product-form__input-quality__label">{unit}</p>
                    <ChevronUp style={{ transform: `rotate(${visible ? 180 : 0}deg)` }} />
                </div>
                <div
                    ref={ref}
                    style={{
                        display: visible ? "block" : "none",
                    }}
                    className="product-form__input-quality__drop"
                >
                    {options.map((item, index) => (
                        <div
                            key={index}
                            className="product-form__input-quality__option"
                            style={{
                                backgroundColor: item.value === unit ? "var(--purple-secondary)" : "transparent",
                            }}
                            onClick={() => {
                                onChange(value, item.value)
                                setVisible(false)
                            }}
                        >
                            {item.label}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
