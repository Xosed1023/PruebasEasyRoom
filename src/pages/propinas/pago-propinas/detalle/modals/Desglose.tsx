import { useMemo } from "react"
import ModalBase from "./base"
import { getCurrencyFormat } from "src/utils/string"
import { ModalProps } from "./index.type"

function Desglose({ onClose, name = "", value = [] }: ModalProps): JSX.Element {
    const data = useMemo(
        () =>
            value?.map((i) => {
                return [i?.categoria || "", getCurrencyFormat(i?.monto || 0), getCurrencyFormat(i?.aportacion || 0)]
            }) || [],
        [value]
    )

    const totals = useMemo(() => {
        let monto = 0
        let aportacion = 0

        value?.forEach((i) => {
            monto += Number(i?.monto || 0)
            aportacion += Number(i?.aportacion || 0)
        })

        return ["Total", getCurrencyFormat(monto), getCurrencyFormat(aportacion)]
    }, [value])

    return (
        <ModalBase
            title={"Desglose de ventas"}
            description={name}
            classNameRow={"propina-modal__recolectada-row"}
            className={"propina-modal__recolectada"}
            isOpen={true}
            onClose={onClose}
            headers={["Categoría", "Venta", "Aportación"]}
            totals={totals}
            data={data}
        />
    )
}

export default Desglose
