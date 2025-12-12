import { useFormContext, useWatch } from "react-hook-form"
import { Button } from "src/shared/components/forms/button/Button"
import { div } from "src/shared/helpers/calculator"
import Ticket, { TicketContent, TicketItem } from "src/shared/sections/ticket/Ticket"
import { getCurrencyFormat } from "src/utils/string"

type ResumenProps = {
    name: string
    unit: string
    quantity: number
    cost: number
    disabled: boolean
    onSubmit: () => void
}

export default function Resumen({ name, unit, quantity, cost, disabled, onSubmit }: ResumenProps): JSX.Element {
    const { control } = useFormContext()

    const cantidad_final = useWatch({ control, name: "cantidad_produccion_final" })
    const costo_produccion = useWatch({ control, name: "costo_produccion" })

    return (
        <Ticket className="produccion__resumen" title={"Resumen"} withButton={false}>
            <TicketContent clasName="produccion__resumen-content">
                <div className="produccion__resumen-grid">
                    <TicketItem label={"Nombre de proceso"} value={name || "-"} icon={"processShape"} />
                    <TicketItem
                        label={"Cantidad a producir por receta"}
                        value={`${quantity} ${unit}`}
                        icon={"RecipeHistory"}
                    />
                    <TicketItem
                        label={"Costo por unidad mínima actual"}
                        value={`${getCurrencyFormat(div(cost, quantity).toFixed(2))}/${unit}`}
                        icon={"coinsFill"}
                    />
                </div>
                <p className="produccion__resumen-label produccion__resumen-costo">
                    <span>{"Costo real de producción"}</span>
                    <span>{getCurrencyFormat(costo_produccion)}</span>
                </p>
            </TicketContent>
            <p className="produccion__resumen-label produccion__resumen-total">
                <span>{"Producción"}</span>
                <span className="produccion__resumen-total__number">{`${Number(cantidad_final || 0)} ${unit}`}</span>
            </p>
            <Button
                disabled={disabled}
                type={"button"}
                className="produccion__resumen-btn"
                text={"Registrar producción"}
                onClick={onSubmit}
            />
        </Ticket>
    )
}
