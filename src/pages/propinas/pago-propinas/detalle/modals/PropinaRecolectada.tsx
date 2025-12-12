import { useMemo } from "react"
import ModalBase from "./base"
import { getCurrencyFormat } from "src/utils/string"
import { ModalProps } from "./index.type"

function Recolectada({ onClose, name = "", value = [] }: ModalProps): JSX.Element {
    const data = useMemo(
        () =>
            value?.map((i) => {
                return [i?.categoria || "", getCurrencyFormat(i?.monto || 0)]
            }) || [],
        [value]
    )

    const totals = useMemo(() => {
        let monto = 0

        value?.forEach((i) => {
            monto += Number(i?.monto || 0)
        })

        return ["Total", getCurrencyFormat(monto)]
    }, [value])

    return (
        <ModalBase
            title={"Propina recolectada"}
            description={name}
            classNameRow={"propina-modal__desglose-row"}
            className={"propina-modal__desglose"}
            isOpen={true}
            onClose={onClose}
            headers={["Categoría", "Monto"]}
            totals={totals}
            data={data}
        />
    )
}

export default Recolectada
