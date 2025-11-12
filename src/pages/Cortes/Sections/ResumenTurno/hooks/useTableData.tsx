import { useEffect, useState } from "react"
import { capitalizeString } from "src/shared/hooks/capitalizeString"
import { formatCurrency } from "src/shared/hooks/formatCurrency"

import LastRowColumn from "../sections/LastRowColumn/LastRowColumn"
import { FlexibleTableRow } from "src/shared/components/data-display/FlexibleTable/flexible-table-items.interface"
import {
    AnticiposValidos,
    Cancelaciones,
    GastosCorte,
    IncidenciaCorte,
    Reservas,
    ResumenCorteTickets,
    ResumenCorteTicketsEstancia,
} from "../interfaces/resumenCorteTickets"
import { ResumenPagos } from "../interfaces/resumenPagos"
import { formatTipoPago } from "src/shared/helpers/formatTipoPago"

export function useRows(resumenCorte?: ResumenCorteTickets, resumenPagos?: ResumenPagos) {
    const [rowsEstancia, setRowsEstancia] = useState<FlexibleTableRow[]>([])
    const [rowsRoomService, setRowsRoomService] = useState<FlexibleTableRow[]>([])
    const [rowsRestaurante, setRowsRestaurante] = useState<FlexibleTableRow[]>([])
    const [rowsReservas, setRowsReservas] = useState<FlexibleTableRow[]>([])
    const [rowsEfectivo, setRowsEfectivo] = useState<FlexibleTableRow[]>([])
    const [rowsGastos, setRowsGastos] = useState<FlexibleTableRow[]>([])
    const [rowsIncidencias, setRowsIncidencias] = useState<FlexibleTableRow[]>([])
    const [rowsCancelaciones, setRowsCancelaciones] = useState<FlexibleTableRow[]>([])
    const [rowsPropinas, setRowsPropinas] = useState<FlexibleTableRow[]>([])
    const [rowsAnticiposValidos, setRowsAnticiposValidos] = useState<FlexibleTableRow[]>([])

    const getRowsEstancia = (data: ResumenCorteTicketsEstancia) => {
        const array: FlexibleTableRow[] = []
        data?.habitaciones?.map((habitaciones) => {
            array.push({
                value: [
                    { value: habitaciones?.concepto },
                    { value: formatCurrency(Number(habitaciones?.precio_promedio)) },
                    { value: habitaciones?.cantidad },
                    { value: formatCurrency(Number(habitaciones?.total)) },
                ],
            })
        })
        data?.extras?.map((extras) => {
            array.push({
                value: [
                    { value: capitalizeString(extras?.concepto) + " extra" },
                    { value: formatCurrency(Number(extras?.precio_promedio)) },
                    { value: extras?.cantidad },
                    { value: formatCurrency(Number(extras?.total)) },
                ],
            })
        })
        array.push({
            value: [
                { value: "Check-in anticipado" },
                { value: formatCurrency(Number(data?.early_checkin?.[0]?.precio_promedio)) },
                { value: data?.early_checkin?.[0]?.cantidad },
                { value: formatCurrency(Number(data?.early_checkin?.[0]?.total)) },
            ],
        })
        array.push({
            value: [
                {
                    value: <LastRowColumn text="Total" bold />,
                },
                {
                    value: <LastRowColumn text="" />,
                },
                {
                    value: <LastRowColumn text="" />,
                },
                {
                    value: <LastRowColumn text={formatCurrency(Number(data?.totales?.monto_total))} />,
                },
            ],
            className: "last-row__resumen-turno",
        })
        return array
    }

    const getRowsAnticiposValidos = (data: AnticiposValidos) => {
        const array: FlexibleTableRow[] = []
        let total = 0
        let total_cantidad = 0
        data?.anticipos_validos_habitaciones?.map((habitaciones) => {
            array.push({
                value: [
                    { value: habitaciones?.concepto },
                    { value: formatCurrency(Number(habitaciones?.precio_promedio)) },
                    { value: habitaciones?.cantidad },
                    { value: formatCurrency(Number(habitaciones?.total)) },
                ],
            })
            total_cantidad += habitaciones?.cantidad
            total += Number(habitaciones?.total)
        })
        data?.anticipos_validos_extras?.map((extras) => {
            array.push({
                value: [
                    { value: capitalizeString(extras?.concepto) + " extra" },
                    { value: formatCurrency(Number(extras?.precio_promedio)) },
                    { value: extras?.cantidad },
                    { value: formatCurrency(Number(extras?.total)) },
                ],
            })
            total += Number(extras?.total)
            total_cantidad += Number(extras?.cantidad)
        })
        array.push({
            value: [
                {
                    value: <LastRowColumn text="Total" bold />,
                },
                {
                    value: <LastRowColumn text="" />,
                },
                {
                    value: <LastRowColumn text={total_cantidad} />,
                },
                {
                    value: <LastRowColumn text={formatCurrency(total)} />,
                },
            ],
            className: "last-row__resumen-turno",
        })
        return array
    }

    const getRowsRoomService = (data: GastosCorte) => {
        const array: FlexibleTableRow[] = []
        data?.desgloce?.map((categoria) => {
            array.push({
                value: [
                    { value: capitalizeString(categoria?.concepto) },
                    { value: categoria?.cantidad },
                    { value: formatCurrency(Number(categoria?.total)) },
                ],
            })
        })
        array.push({
            value: [
                {
                    value: <LastRowColumn text="Total" bold />,
                },
                {
                    value: <LastRowColumn text="" />,
                },
                {
                    value: <LastRowColumn text={formatCurrency(Number(data?.totales?.monto_total))} />,
                },
            ],
            className: "last-row__resumen-turno",
        })
        return array
    }

    const getRowsRestaurante = (data: GastosCorte) => {
        const array: FlexibleTableRow[] = []
        data?.desgloce?.map((categoria) => {
            array.push({
                value: [
                    { value: capitalizeString(categoria?.concepto) },
                    { value: categoria?.cantidad },
                    { value: formatCurrency(Number(categoria?.total)) },
                ],
            })
        })
        array.push({
            value: [
                {
                    value: <LastRowColumn text="Total" bold />,
                },
                {
                    value: <LastRowColumn text="" />,
                },
                {
                    value: <LastRowColumn text={formatCurrency(Number(data?.totales?.monto_total))} />,
                },
            ],
            className: "last-row__resumen-turno",
        })
        return array
    }

    const getRowsCancelaciones = (data: Cancelaciones) => {
        const array: FlexibleTableRow[] = []
        if (data) {
            if (Number(data?.estancia.total) > 0) {
                array.push({
                    value: [
                        { value: "Estancia" },
                        { value: data?.estancia?.cantidad },
                        { value: formatCurrency(Number(data?.estancia?.total)) },
                    ],
                })
            }
            if (Number(data?.roomservice.total) > 0) {
                array.push({
                    value: [
                        { value: "Room service" },
                        { value: data?.roomservice[0]?.cantidad },
                        { value: formatCurrency(Number(data?.roomservice?.total)) },
                    ],
                })
            }
            if (Number(data?.totales?.monto_total) > 0) {
                array.push({
                    value: [
                        {
                            value: <LastRowColumn text="Total" bold />,
                        },
                        {
                            value: <LastRowColumn text="" />,
                        },
                        {
                            value: <LastRowColumn text={formatCurrency(Number(data?.totales?.monto_total))} />,
                        },
                    ],
                    className: "last-row__resumen-turno",
                })
            }
        }

        return array
    }

    const getRowsReservas = (data: Reservas) => {
        const array: FlexibleTableRow[] = []
        if (!data?.anticipos_reserva?.length || !data?.saldos_reservas?.length) {
            return array
        }
        data?.saldos_reservas?.map((saldos) => {
            array.push({
                value: [
                    { value: saldos?.concepto },
                    { value: saldos?.cantidad },
                    { value: formatCurrency(Number(saldos?.total)) },
                ],
            })
        })
        data?.anticipos_reserva?.map((anticipos) => {
            array.push({
                value: [
                    { value: anticipos?.concepto },
                    { value: anticipos?.cantidad },
                    { value: formatCurrency(Number(anticipos?.total)) },
                ],
            })
        })
        array.push({
            value: [
                {
                    value: <LastRowColumn text="Total" bold />,
                },
                {
                    value: <LastRowColumn text="" />,
                },
                {
                    value: <LastRowColumn text={formatCurrency(Number(data?.totales?.monto_total))} />,
                },
            ],
            className: "last-row__resumen-turno",
        })
        return array
    }

    const getRowsEfectivo = (data: ResumenPagos) => {
        const array: FlexibleTableRow[] = []
        data.fajillas.desgloce?.map((fajilla) => {
            array.push({
                value: [
                    { value: "Retiros de efectivo" },
                    { value: fajilla?.cantidad },
                    { value: formatCurrency(Number(fajilla?.monto)) },
                    { value: formatCurrency(Number(fajilla?.total)) },
                ],
            })
        })
        array.push({
            value: [
                { value: "Efectivo en caja" },
                { value: "" },
                { value: formatCurrency(Number(data?.efectivo_disponible_recepcion || 0)) },
                {
                    value: formatCurrency(Number(data?.efectivo_disponible_recepcion || 0)),
                },
            ],
        })
        array.push({
            value: [
                {
                    value: <LastRowColumn text="Total" bold />,
                },
                {
                    value: <LastRowColumn text={""} />,
                },
                {
                    value: <LastRowColumn text="" />,
                },
                {
                    value: <LastRowColumn text={formatCurrency(Number(data?.efectivo_menos_gastos || 0))} />,
                },
            ],
            className: "last-row__resumen-turno",
        })
        return array
    }

    const getRowsPropinas = (data: GastosCorte) => {
        const array: FlexibleTableRow[] = []
        if (!data?.desgloce?.length) {
            return array
        }
        data?.desgloce?.map((desgloce) => {
            array.push({
                value: [
                    { value: desgloce?.concepto ? formatTipoPago(desgloce?.concepto) : "Otro"},
                    { value: desgloce?.cantidad },
                    { value: formatCurrency(Number(desgloce?.total)) },
                ],
            })
        })
        array.push({
            value: [
                {
                    value: <LastRowColumn text="Total" bold />,
                },
                {
                    value: <LastRowColumn text="" />,
                },
                {
                    value: <LastRowColumn text={formatCurrency(Number(data?.totales?.monto_total))} />,
                },
            ],
            className: "last-row__resumen-turno",
        })
        return array
    }

    const getRowsGastos = (data: GastosCorte) => {
        const array: FlexibleTableRow[] = []
        if (!data?.desgloce?.length) {
            return array
        }
        data?.desgloce?.map((gastos) => {
            array.push({
                value: [{ value: gastos.concepto }, { value: formatCurrency(Number(gastos?.total)) }],
            })
        })
        array.push({
            value: [
                {
                    value: <LastRowColumn text="Total" bold />,
                },
                {
                    value: <LastRowColumn text={formatCurrency(Number(data?.totales?.monto_total))} />,
                },
            ],
            className: "last-row__resumen-turno",
        })
        return array
    }

    const getRowsIncidencias = (data: IncidenciaCorte[]) => {
        const array: FlexibleTableRow[] = []
        data?.map((incidencias: IncidenciaCorte) => {
            array.push({
                value: [
                    { value: incidencias.folio },
                    { value: incidencias.estado === "activa" ? "Abierta" : "Cerrada" },
                    { value: incidencias.detalle },
                    { value: capitalizeString(incidencias.severidad) },
                    { value: capitalizeString(incidencias.area) },
                    { value: incidencias.numero_habitacion || "N/A" },
                ],
            })
        })

        return array
    }

    useEffect(() => {
        if (resumenCorte && resumenPagos) {
            setRowsEstancia(getRowsEstancia(resumenCorte.estancia))
            setRowsRoomService(getRowsRoomService(resumenCorte.room_service))
            setRowsRestaurante(getRowsRestaurante(resumenCorte.restaurante))
            setRowsReservas(getRowsReservas(resumenCorte.reservas))
            setRowsEfectivo(getRowsEfectivo(resumenPagos))
            setRowsGastos(getRowsGastos(resumenCorte.gastos_corte))
            setRowsIncidencias(getRowsIncidencias(resumenCorte.incidencias_corte))
            setRowsCancelaciones(getRowsCancelaciones(resumenCorte.cancelaciones))
            setRowsPropinas(getRowsPropinas(resumenCorte.propinas_corte))
            setRowsAnticiposValidos(getRowsAnticiposValidos(resumenCorte.anticipos_validos))
        } else {
            setRowsRoomService([])
            setRowsRestaurante([])
            setRowsEstancia([])
            setRowsReservas([])
            setRowsEfectivo([])
            setRowsGastos([])
            setRowsIncidencias([])
            setRowsCancelaciones([])
            setRowsAnticiposValidos([])
        }
    }, [resumenCorte, resumenPagos])

    return {
        rowsEstancia,
        rowsRoomService,
        rowsRestaurante,
        rowsReservas,
        rowsEfectivo,
        rowsGastos,
        rowsIncidencias,
        rowsCancelaciones,
        rowsPropinas,
        rowsAnticiposValidos,
    }
}
