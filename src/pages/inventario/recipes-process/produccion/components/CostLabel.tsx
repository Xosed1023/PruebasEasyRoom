import { useFormContext, useWatch } from "react-hook-form"
import { getCurrencyDecimalFormat } from "src/utils/string"

export default function CostLabel({ unidad }): JSX.Element {
    const { control } = useFormContext()
    const costo = useWatch({ control, name: "costo_unitario" })
    const cantidad_produccion_final = useWatch({ control, name: "cantidad_produccion_final" })

    const length = `${cantidad_produccion_final}`.length
    const value = Number(Number(costo).toFixed(length > 3 ? length : 3))

    return <span>{`${getCurrencyDecimalFormat(value)}/${unidad}`}</span>
}
