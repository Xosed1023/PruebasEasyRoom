import { Control, Controller } from "react-hook-form"
import { InputCurrency } from "src/shared/sections/payment/InputCurrency"
import { Tooltip } from "./Tooltip"
import { FormValues } from "../Form.types"

type InputPriceProps = {
    control: Control<FormValues, any>
}

export const InputPrice = ({ control }: InputPriceProps) => {
    const insumo = false

    return (
        <div className="product-form__input-price" style={{ opacity: !insumo ? 1 : 0.5 }}>
            <Controller
                control={control}
                name={"precio"}
                rules={{ required: !insumo, validate: !insumo ? (value) => value > 0 : undefined }}
                render={({ field: { value, onChange }, fieldState: { error } }) => (
                    <InputCurrency
                        whiteSpace={true}
                        value={value}
                        error={!!error}
                        onChange={onChange}
                        label={"Precio de venta al público"}
                        placeholder={"Escribe un monto"}
                        errorhinttext={"Escribe el precio de venta"}
                        icon="dollarCircle"
                    />
                )}
            />
            <div className="product-form__input-price__info">
                <span className="product-form__input-price__label">{"Impuesto incluido: 16%"}</span>
                <Tooltip
                    title={"Impuesto incluido"}
                    description={
                        "Porcentaje de impuesto que incluye el precio de venta del producto. Puedes modificar el porcentaje desde “Configuración del hotel”."
                    }
                />
            </div>
            {insumo && <div className="product-form__mask-disabled" />}
        </div>
    )
}
