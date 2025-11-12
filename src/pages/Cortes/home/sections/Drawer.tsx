// import { useMutation } from "@apollo/client"
import { useQuery } from "@apollo/client"
import DescriptionDetail from "src/shared/components/data-display/description-detail/DescriptionDetail"
import Drawer from "src/shared/components/layout/drawer/Drawer"
import { OBTENER_TICKET } from "../graphql/ticket"
import { formatCurrency } from "src/shared/hooks/formatCurrency"
import { PAYMENT_TYPES, monthNames } from "../data/Cortes.constants"
import { getExactDate } from "src/utils/date"
import { getName } from "src/pages/propinas/home/helpers/name"

export function CancellationDetails({
    onClose,
    isOpen,
    ticketId,
}: {
    onClose: () => void
    isOpen: boolean
    ticketId: string
}): JSX.Element {
    const info = ticketId?.split("/")

    const { data: data } = useQuery(OBTENER_TICKET, {
        variables: {
            ticket_id: info[0],
        },
    })

    function formatDate(isoDate) {
        const date = new Date(isoDate)

        const day = String(date.getDate()).padStart(2, "0")
        const month = monthNames[date.getMonth()]
        const year = String(date.getFullYear()).slice(-2)

        let hours = date.getHours()
        const minutes = String(date.getMinutes()).padStart(2, "0")
        const ampm = hours >= 12 ? "pm" : "am"
        hours = hours % 12 || 12

        return `${day}/${month}/${year}  ${hours}:${minutes}${ampm}`
    }

    function TotalMetodosPago() {
        const metodosPago = data?.ticket?.data?.metodos_pago
        const total = metodosPago?.reduce((acumulador, metodo) => {
            return acumulador + metodo.total
        }, 0)
        return total
    }

    return (
        <Drawer placement={"right"} bar={false} visible={isOpen} withCloseButton={true} onClose={onClose}>
            <div>
                <div className="detalle-h-view__head" style={{ marginTop: 24 }}>
                    <p className="detalle-h-view__title">Cancelación</p>
                    <p className="detalle-h-view__subtitle">{data?.ticket.folio || "-"}</p>
                </div>
            </div>
            <div>
                <div
                    className="reservas-screen__drawer__description"
                    style={{
                        height: "calc(100dvh - 160px)",
                    }}
                >
                    <DescriptionDetail
                        icon={"dollarCircle"}
                        label={"Monto"}
                        value={data?.ticket?.data ? formatCurrency(TotalMetodosPago()) : "-"}
                    />
                    <DescriptionDetail
                        icon={"creditCard"}
                        label={"Método de pago"}
                        value={
                            data?.ticket
                                ? data?.ticket?.data?.metodos_pago.length > 1
                                    ? "Mixto"
                                    : PAYMENT_TYPES[data?.ticket?.data?.metodos_pago[0].tipo]?.label
                                : "-"
                        }
                    />
                    <DescriptionDetail icon={"FolderFill"} label={"Categoría"} value={info[1] || "-"} />
                    <DescriptionDetail
                        icon={"Document"}
                        label={"Concepto de cancelación"}
                        value={data?.ticket ? data?.ticket?.motivo_cancelacion : "-"}
                    />
                    <DescriptionDetail
                        icon={"calendarChecked"}
                        label="Fecha y hora de venta"
                        value={
                            data?.ticket?.fecha_impresion
                                ? formatDate(getExactDate(data?.ticket?.fecha_impresion))
                                : "-"
                        }
                    />
                    <DescriptionDetail
                        icon={"calendarFill"}
                        label="Fecha y hora de cancelación"
                        value={
                            data?.ticket?.fecha_cancelacion
                                ? formatDate(getExactDate(data?.ticket?.fecha_cancelacion))
                                : "-"
                        }
                    />
                    <DescriptionDetail
                        icon={"userFilled"}
                        label={"Responsable"}
                        value={data?.ticket?.usuario ? getName(data?.ticket?.usuario) : "-"}
                    />
                </div>
            </div>
        </Drawer>
    )
}
