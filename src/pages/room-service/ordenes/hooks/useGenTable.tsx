import { DetallePago, OrdenesQuery, OrigenOrden } from "src/gql/schema"
import { FlexibleTableRow } from "src/shared/components/data-display/FlexibleTable/flexible-table-items.interface"
import { getPaymentMethod } from "../helpers/getPaymentMethod/getPaymentMethod"
import { PrintType, usePrintTicket } from "src/shared/hooks/print"
import Icon from "src/shared/icons"
import { useDate } from "src/shared/hooks/useDate"
import { StatusOrdenPagoCell, StatusOrdenCell } from "../helpers/statusOrdenCell/StatusOrdenCell"
import { transformStatusOrdenText } from "../helpers/transformStatusOrdenText"
import { OrdenesPaths } from "../Ordenes.types"
import { getCurrencyFormat } from "src/utils/string"
import { getName } from "src/pages/propinas/home/helpers/name"
import { capitalizeString } from "src/shared/hooks/capitalizeString"
import { getFilterDetalles } from "../helpers/detalles-orden"
import { useFormatDate } from "src/shared/hooks/useFormatDate"

// hook para dar formato a los registros de las ordenes de roomService
export const useGenTable = () => {
    const { handlePrint } = usePrintTicket("snackbar-mini")
    const { UTCStringToLocalDate } = useDate()
    const { formatCustomDate } = useFormatDate()

    const genTable = ({
        ordenes = [],
        filter,
    }: {
        ordenes: OrdenesQuery["ordenes"]
        filter: OrdenesPaths
    }): FlexibleTableRow[] => {
        return genTableTodas(UTCStringToLocalDate, formatCustomDate, ordenes, handlePrint)
    }

    return { genTable }
}

const genTableTodas = (
    UTCStringToLocalDate: (UTCString?: string | undefined) => Date,
    formatCustomDate: (fecha: any, mask: string) => string,
    ordenes: OrdenesQuery["ordenes"],
    onPrint?: (ticketId: string, printType?: PrintType, customType?: string) => void
): FlexibleTableRow[] => {
    const arrayTable: FlexibleTableRow[] = []

    const orderList =
        ordenes?.sort((a, b) => new Date(b?.fecha_registro).getTime() - new Date(a?.fecha_registro).getTime()) || []

    orderList?.map((orden) => {
        const detallesPago = orden?.pagos?.flatMap((p) => p.detalles_pago || []) || []

        arrayTable.push({
            goTo: orden.orden_id,
            value: [
                {
                    value: orden.consumo_interno_colaborador_id ? (
                        "C" + orden.orden
                    ) : (
                        <div className="ordenes__table__cell-concept">
                            <span className="ordenes__table__cell-concept__title">{orden.orden}</span>

                            {orden.usuario_id === "ffb2168b-a25d-4f48-b1ef-5b088e6bdff3" && (
                                <span className="ordenes__table__cell-concept__subtitle2">
                                    Creado en {orden?.usuario?.nombre}
                                </span>
                            )}
                        </div>
                    ),
                },
                {
                    value: <StatusOrdenCell value={orden?.estado_orden || ""} origen={orden?.origen_orden || ""} />,
                },
                {
                    value: (
                        <div className="ordenes__table__cell-concept">
                            <span className="ordenes__table__cell-concept__title">
                                {orden.renta_id
                                    ? orden.renta?.habitacion?.tipo_habitacion?.nombre
                                    : orden?.origen_orden === OrigenOrden.Restaurante
                                    ? `Mesa ${orden?.mesa?.numero_mesa}`
                                    : capitalizeString(orden?.origen_orden || "")}
                            </span>
                            {orden.renta_id && (
                                <span className="ordenes__table__cell-concept__subtitle">
                                    {orden.renta?.habitacion?.numero_habitacion}
                                </span>
                            )}
                        </div>
                    ),
                },
                { value: orden?.turno?.nombre || "-" },
                {
                    value: orden.fecha_registro
                        ? (() => {
                            const f = UTCStringToLocalDate(orden.fecha_registro)
                            return `${formatCustomDate(f, "DD/MMM/YY")} ${formatCustomDate(f, "hh:mm a")}`
                        })()
                        : "-",
                },
                {
                    value: (
                        <span className="ordenes__table__cell-name">
                            {orden?.colaborador_entrega ? getName(orden?.colaborador_entrega) : "-"}
                        </span>
                    ),
                },
                { value: `${getFilterDetalles(orden).length}` },
                {
                    value: `${getCurrencyFormat(
                        Number(orden.total_con_iva || 0) + Number(orden?.propina?.total || 0)
                    )}`,
                },
                {
                    //mostrar todos los métodos de pago concatenados
                    value: detallesPago.length ? getPaymentMethod(detallesPago as DetallePago[]) : "-",
                },
                {
                    value: (
                        <StatusOrdenPagoCell
                            statusOrden={orden?.estado_orden}
                            statusOrdenPago={orden.estado_pago}
                            text={transformStatusOrdenText({
                                statusOrden: orden.estado_orden || undefined,
                                statusOrdenPago: orden.estado_pago,
                            })}
                        />
                    ),
                },
                {
                    value: (
                        <div
                            onClick={(e) => {
                                e.stopPropagation()
                                // si hay pagos, imprime el último ticket registrado
                                if (detallesPago.length > 0) {
                                    const lastTicket = orden.pagos?.[orden.pagos.length - 1]?.ticket_id || ""
                                    onPrint?.(lastTicket, "copia")
                                } else if (orden.estado_pago === "no_pagada") {
                                    onPrint?.(orden.orden_id || "", "custom", "3")
                                }
                            }}
                        >
                            <Icon
                                name="printer"
                                className="ordenes__icon-printer"
                                color="#6941C6"
                                height={"20px"}
                                width={"20px"}
                            />
                        </div>
                    ),
                },
            ],
        })
    })

    return arrayTable
}

/*
const genTablePagadas = ({
    UTCStringToLocalDate,
    ordenes,
    onPrint,
}: {
    UTCStringToLocalDate: (UTCString?: string | undefined) => Date
    ordenes: OrdenesQuery["ordenes"]
    onPrint?: (ticketId: string, printType?: PrintType) => void
}) => {
    const arrayTable: FlexibleTableRow[] = []
    ordenes?.map((orden, index) => {
        arrayTable.push({
            goTo: orden.orden_id,
            value: [
                { value: orden.orden },
                { value: getFormatLongDateHour(UTCStringToLocalDate(orden.fecha_registro)) },
                { value: orden?.turno?.nombre || "-" },
                {
                    value: orden.renta_id
                        ? `${orden.renta?.habitacion?.tipo_habitacion?.nombre} ${orden.renta?.habitacion?.numero_habitacion}`
                        : "Mostrador",
                },
                { value: orden?.detalles_orden?.length + "" },
                { value: orden.pago ? getPaymentMethod(orden.pago?.detalles_pago as DetallePago[]) : "-" },
                { value: "$" + orden.total_con_iva },
                {
                    value: orden.pago ? (
                        <div
                            onClick={(e) => {
                                e.stopPropagation()
                                onPrint?.(orden.pago?.ticket_id || "", "copia")
                            }}
                        >
                            <Icon
                                name="printer"
                                className="ordenes__icon-printer"
                                color="#6941C6"
                                height={"20px"}
                                width={"20px"}
                            />
                        </div>
                    ) : (
                        <div
                            onClick={(e) => {
                                e.stopPropagation()
                                onPrint?.(orden.pago?.ticket_id || "", "copia")
                            }}
                        >
                            <Icon
                                name="printer"
                                className="ordenes__icon-printer"
                                color="#6941C6"
                                height={"20px"}
                                width={"20px"}
                            />
                        </div>
                    ),
                },
            ],
        })
    })
    return arrayTable
}
const genTableCanceladas = ({
    UTCStringToLocalDate,
    ordenes,
    onPrint,
}: {
    UTCStringToLocalDate: (UTCString?: string | undefined) => Date
    ordenes: OrdenesQuery["ordenes"]
    onPrint?: (ticketId: string, printType?: PrintType) => void
}) => {
    const arrayTable: FlexibleTableRow[] = []
    ordenes?.map((orden, index) => {
        arrayTable.push({
            goTo: orden.orden_id,
            value: [
                { value: orden.orden },
                {
                    value: orden.renta_id
                        ? `${orden.renta?.habitacion?.tipo_habitacion?.nombre} ${orden.renta?.habitacion?.numero_habitacion}`
                        : "Mostrador",
                },
                { value: orden?.turno?.nombre || "-" },
                { value: getFormatLongDateHour(UTCStringToLocalDate(orden.fecha_registro)) },
                { value: orden?.detalles_orden?.length + "" },
                { value: "$" + orden.total_con_iva },
                {
                    value: orden.pago ? (
                        <div
                            onClick={(e) => {
                                e.stopPropagation()
                                onPrint?.(orden.pago?.ticket_id || "", "copia")
                            }}
                        >
                            <Icon
                                name="printer"
                                className="ordenes__icon-printer"
                                color="#6941C6"
                                height={"20px"}
                                width={"20px"}
                            />
                        </div>
                    ) : (
                        <div
                            onClick={(e) => {
                                e.stopPropagation()
                                onPrint?.(orden.pago?.ticket_id || "", "copia")
                            }}
                        >
                            <Icon
                                name="printer"
                                className="ordenes__icon-printer"
                                color="#6941C6"
                                height={"20px"}
                                width={"20px"}
                            />
                        </div>
                    ),
                },
            ],
        })
    })
    return arrayTable
}
const genTablePendientes = (
    UTCStringToLocalDate: (UTCString?: string | undefined) => Date,
    ordenes: OrdenesQuery["ordenes"],
    onPrint?: (ticketId: string, printType?: PrintType) => void
): FlexibleTableRow[] => {
    const arrayTable: FlexibleTableRow[] = []
    ordenes?.map((orden, index) => {
        arrayTable.push({
            goTo: orden.orden_id,
            value: [
                { value: orden.orden },
                { value: orden?.turno?.nombre || "-" },
                { value: getFormatLongDateHour(UTCStringToLocalDate(orden.fecha_registro)) },
                {
                    value: orden.renta_id
                        ? `${orden.renta?.habitacion?.tipo_habitacion?.nombre} ${orden.renta?.habitacion?.numero_habitacion}`
                        : "Mostrador",
                },
                { value: orden?.detalles_orden?.length + "" },
                { value: "$" + orden.total_con_iva },
                {
                    value: orden.pago ? (
                        <div
                            onClick={(e) => {
                                e.stopPropagation()
                                onPrint?.(orden.pago?.ticket_id || "", "copia")
                            }}
                        >
                            <Icon
                                name="printer"
                                className="ordenes__icon-printer"
                                color="#6941C6"
                                height={"20px"}
                                width={"20px"}
                            />
                        </div>
                    ) : (
                        <div
                            onClick={(e) => {
                                e.stopPropagation()
                                onPrint?.(orden.pago?.ticket_id || "", "copia")
                            }}
                        >
                            <Icon
                                name="printer"
                                className="ordenes__icon-printer"
                                color="#6941C6"
                                height={"20px"}
                                width={"20px"}
                            />
                        </div>
                    ),
                },
            ],
        })
    })
    return arrayTable
}

*/
