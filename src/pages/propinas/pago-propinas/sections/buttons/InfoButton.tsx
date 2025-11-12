import { useState } from "react"
import InfoCircle from "src/shared/icons/InfoCircle"
import ModalGeneral from "../../modals/general"

const paragraphs_short = [
    {
        label: "Monto acumulado:",
        value: "Monto disponible de propinas para pagar a los colaboradores según lo recaudado.",
    },
    {
        label: "Propina por ventas:",
        value: "Total de acumulado de propinas por el vendedor o mesero por medio de ventas de room service o habitaciones restándole sus comisiones.",
    },
    {
        label: "Fondo de propina:",
        value: "Total acumulado destinado a distribuir propinas entre los colaboradores, resultante de un porcentaje de las ventas.",
    },
    {
        label: "Comisión bancaria sobre fondo:",
        value: "Porcentaje de comisión sobre el fondo de propina por uso de terminal bancaria",
    },
    {
        label: "Pago correspondiente:",
        value: "Resultado total de la resta de la comisión bancaria sobre fondo de propina. ",
    },
]

const paragraphs_large = [
    {
        label: "Propina recolectada:",
        value: "Acumulado de propinas por el vendedor o mesero por medio de ventas de room service o habitaciones",
    },
    {
        label: "Aportación a fondo:",
        value: "Porcentaje de la venta que se aportará al fondo de propinas para el pago a colaboradores, según el porcentaje configurado para cada puesto o rol",
    },
    {
        label: "Subtotal de propina por venta:",
        value: "Resultado de la resta de la aportación a fondo a la propina recolectada",
    },
    {
        label: "Comisión bancaria sobre propina por venta:",
        value: "Porcentaje de comisión sobre la propina recolectada por uso de terminal bancaria",
    },
    {
        label: "Neto propina por ventas:",
        value: "Resultado de la resta de la comisión bancaria sobre propina por venta en el subtotal de propina por venta",
    },
    {
        label: "Fondo de propina:",
        value: "Total acumulado destinado a distribuir propinas entre los colaboradores, resultante de un porcentaje de las ventas.",
    },
    {
        label: "Comisión bancaria sobre fondo:",
        value: "Porcentaje de comisión sobre el fondo de propina por uso de terminal bancaria",
    },
    {
        label: "Pago correspondiente:",
        value: "Resultado total de la resta de la comisión bancaria sobre fondo de propina. ",
    },
]

function InfoButton({ large = false }): JSX.Element {
    const [visible, setVisible] = useState<boolean>(false)

    return (
        <>
            <InfoCircle height={28} width={28} color={"var(--primary)"} onClick={() => setVisible(true)} />
            <ModalGeneral
                visible={visible}
                onClose={() => setVisible(false)}
                paragraphs={large ? paragraphs_large : paragraphs_short}
                height={large ? 686 : 484}
            />
        </>
    )
}

export default InfoButton
