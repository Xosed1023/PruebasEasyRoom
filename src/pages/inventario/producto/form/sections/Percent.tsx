import { Control, useWatch } from "react-hook-form"
import { minus } from "src/shared/helpers/calculator"
import { FormValues } from "../Form.types"

type PercentProps = {
    control: Control<FormValues, any>
}

export const Percent = ({ control }: PercentProps) => {
    const [costo, precio] = useWatch({ control, name: ["costo", "precio"] })
    const insumo = false

    const getPercent = (): number => {
        const absPrecio = minus(precio, costo)

        return Number(Number((absPrecio * 100) / costo).toFixed(2))
    }

    const percent = insumo ? 0 : costo > 0 && precio > 0 ? getPercent() : 0

    return (
        <div className="product-form__percent" style={{ opacity: !insumo ? 1 : 0.5 }}>
            <p className="product-form__percent__label">{"Porcentaje de ganancia por unidad"}</p>
            <p
                className="product-form__percent__value"
                style={{ color: percent < 0 ? "var(--pink-ocupado)" : "var(--tipografa)" }}
            >{`${percent}%`}</p>
            {insumo && <div className="product-form__mask-disabled" />}
        </div>
    )
}
