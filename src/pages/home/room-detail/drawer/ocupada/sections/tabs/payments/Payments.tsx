import { useEffect, useState } from "react"
import DrawerAccordion from "../../../../../../../../shared/components/data-display/drawer-accordion/DrawerAccordion"
import cx from "classnames"
import "./Payments.css"
import { PrimaryButton } from "src/pages/home/room-detail/sections/elements/Elements"
import { useNavigate } from "react-router-dom"
import { useRoom } from "src/pages/home/room-detail/hooks"
import { ItemMultiplePayment, ItemPayment } from "src/pages/home/room-detail/sections/items/Items"
import { useQuery } from "@apollo/client"
import { GET_ROOM } from "src/pages/home/graphql/queries/rooms.query"
import { EstadosOrdenHistorial, Habitacion } from "src/gql/schema"
import { TIPOS_EXTRAS } from "src/constants/payments"

import { v4 as uuid } from "uuid"
import { formatCurrency } from "src/shared/hooks/formatCurrency"
import { useProfile } from "src/shared/hooks/useProfile"
import { sum } from "src/shared/helpers/calculator"
import { getCardLabel } from "src/shared/sections/payment/helpers/card"
import { useData } from "../roomService/hooks/data"
import useIsColaboradorActive from "src/shared/hooks/useIsColaboradorActive"
import { useDate } from "src/shared/hooks/useDate"
import { RoleNames } from "src/shared/hooks/useAuth"
import { useFormatDate } from "src/shared/hooks/useFormatDate"

const mapTiposExtrasIcon = {
    [TIPOS_EXTRAS.persona]: "UserParentFill",
    [TIPOS_EXTRAS.hospedaje]: "MoonFill",
    [TIPOS_EXTRAS.hora]: "Clock",
}

const mapTiposExtrasTitulo = {
    [TIPOS_EXTRAS.persona]: "Personas extras",
    [TIPOS_EXTRAS.hospedaje]: "Noches extras",
    [TIPOS_EXTRAS.hora]: "Horas extras",
}

const Payments = () => {
    const navigate = useNavigate()
    const room = useRoom()
    const { usuario_id, rolName, hotel_id } = useProfile()
    const { getOrdersInfo } = useData()
    const { InactiveModal, validateIsColabActive } = useIsColaboradorActive()
    const {  UTCStringToLocalDate } = useDate()
    const { formatCustomDate } = useFormatDate()

    const { data } = useQuery<{ habitacion: Habitacion }>(GET_ROOM, {
        variables: { habitacion_id: room?.habitacion_id, usuario_id: usuario_id, hotel_id },
        fetchPolicy: "no-cache",
    })

    const [totalPagado, setTotalPagado] = useState<number>(0)
    const [totalPorPagar, setTotalPorPagar] = useState<number>(0)

    const [ordenesPendientesState, setOrdenesPendientesState] = useState<any[]>([])

    const estanciaPendienteTotal = data?.habitacion?.ultima_renta?.saldo_pendiente_estancia || 0
    const extrasPendientes =
        data?.habitacion.ultima_renta?.extras
            ?.filter((extra) => !extra.fecha_pago)
            .reduce((acc, extra) => acc + (extra.monto_extra || 0), 0) || 0

    const estanciaPendiente = estanciaPendienteTotal - extrasPendientes
    const canRegisterPayment =
        totalPorPagar > 0 &&
        [RoleNames.admin, RoleNames.superadmin, RoleNames.recepcionista].map(String).includes(rolName)

    const tipoAlojamiento = data?.habitacion?.ultima_renta?.tarifa?.tipo_alojamiento || ""
    const experiencias = data?.habitacion?.ultima_renta?.reserva_id
        ? data?.habitacion?.ultima_reserva?.reserva?.experiencias_reserva || []
        : []

    const propinasEstancia = (data?.habitacion?.ultima_renta?.propinas ?? []).reduce(
        (total, p) => total + (p?.total || 0),
        0
    )
    const propinasRS = (data?.habitacion?.ultima_renta?.ordenes ?? []).reduce(
        (total, orden) => total + (orden?.propina?.total || 0),
        0
    )

    useEffect(() => {
        const ordenesAll = data?.habitacion?.ultima_renta?.ordenes || []
        const {
            ordenesPendientes,
            totalPendiente: totalPendienteOrdenes,
            totalPropinas: totalPropinasOrdenes,
        } = getOrdersInfo(ordenesAll)

        setOrdenesPendientesState(ordenesPendientes)

        setTotalPagado(
            sum([
                ...(data?.habitacion.ultima_renta?.pagos?.map((p) => p.total) || []),
                propinasEstancia,
                totalPropinasOrdenes,
            ])
        )

        setTotalPorPagar(sum([data?.habitacion?.ultima_renta?.saldo_pendiente_estancia || 0, totalPendienteOrdenes]))
    }, [data])

    return (
        <div
            className={cx({
                "animante__opacity-transform__ease": true,
                "room-detail--occupied__tab--payments--main": true,
                "room-detail--occupied__tab--payments__box": true,
                "room-detail--occupied__tab--payments__box--no-button": !canRegisterPayment,
            })}
        >
            <div className="room-detail--occupied__tab--payments__list">
                <DrawerAccordion
                    title="Pagos registrados"
                    isEmpty={totalPagado <= 0}
                    emptyDescription="No hay pagos registrados"
                    emptyIcon={"CoinsFill"}
                >
                    {data?.habitacion?.ultima_renta?.pagos
                        ?.filter((p) => {
                            if (!p.fecha_pago) return false

                            // Excluir pagos de extras
                            const isExtra = p.extras && p.extras.length > 0

                            // Excluir pagos que pertenecen a ordenes
                            const isRoomService = data?.habitacion?.ultima_renta?.ordenes?.some((orden) => {
                                // Coincidencia directa con pago_id
                                if (orden?.pago_id === p.pago_id) return true
                                const diffMinutes =
                                    Math.abs(
                                        new Date(p.fecha_pago).getTime() - new Date(orden.fecha_registro).getTime()
                                    ) / 60000
                                if (diffMinutes < 2) return true

                                return false
                            })

                            return !isExtra && !isRoomService
                        })
                        ?.map((pago, index, pagosFiltrados) => {
                            const isMixed = (pago?.detalles_pago?.length || 0) > 1
                            const pagosList = pago?.detalles_pago?.map((d) => getCardLabel(d, isMixed)) || [
                                "desconocido",
                            ]

                            const pagoTieneLovePoints =
                                pago.detalles_pago?.some((d) => d.tipo_pago === "love_points") ?? false

                            let pagosParcial: string[] = pagosList

                            if (pagoTieneLovePoints) {
                                const pagoRelacionado = pagosFiltrados.find(
                                    (p, i) =>
                                        i !== index &&
                                        Math.abs(
                                            new Date(p.fecha_pago).getTime() - new Date(pago.fecha_pago).getTime()
                                        ) < 60000 &&
                                        p.detalles_pago?.some(
                                            (d) =>
                                                d.tipo_pago !== "love_points" &&
                                                d.tipo_pago !== pago.detalles_pago?.[0]?.tipo_pago
                                        )
                                )

                                if (pagoRelacionado) {
                                    pagosParcial = [
                                        ...(pago.detalles_pago?.map((d) =>
                                            d.tipo_pago === "love_points" ? "Love points" : getCardLabel(d, true)
                                        ) || []),
                                        ...(pagoRelacionado.detalles_pago?.map((d) => getCardLabel(d, true)) || []),
                                    ]
                                } else {
                                    pagosParcial =
                                        pago.detalles_pago?.map((d) =>
                                            d.tipo_pago === "love_points" ? "Love points" : getCardLabel(d, true)
                                        ) || []
                                }
                            }

                            return (
                                <ItemPayment
                                    withPrinter={false}
                                    key={pago.pago_id}
                                    icon="HotelFilled"
                                    label="Estancia"
                                    value={data?.habitacion?.tipo_habitacion?.nombre || ""}
                                    amount={pago.total || 0}
                                    payments={pagosParcial}
                                    onPrint={() => console.log("Print")}
                                    dateBottom
                                    printBottom
                                    dateBottomText={
                                        pago?.fecha_pago
                                            ? formatCustomDate(
                                                UTCStringToLocalDate(pago.fecha_pago),
                                                "D MMM YYYY, hh:mm a"
                                            )
                                            : "-"
                                    }
                                />
                            )
                        })}

                    {data?.habitacion.ultima_renta?.extras
                        ?.filter((e) => e.fecha_pago)
                        .map((e) => {
                            const pagoExtra = data?.habitacion?.ultima_renta?.pagos?.find((p) =>
                                p.extras?.some((extra) => extra.extra_id === e.extra_id)
                            )
                            const isMixedExtra = (pagoExtra?.detalles_pago?.length || 0) > 1
                            const pagosListExtra = pagoExtra?.detalles_pago?.map((d) =>
                                getCardLabel(d, isMixedExtra)
                            ) || ["desconocido"]
                            return (
                                <ItemPayment
                                    withPrinter={false}
                                    key={e.extra_id}
                                    icon={mapTiposExtrasIcon[e.tipo_extra || ""] || "HotelFilled"}
                                    label={
                                        tipoAlojamiento === "motel" && e.tipo_extra === TIPOS_EXTRAS.hospedaje
                                            ? "Estancia extra"
                                            : mapTiposExtrasTitulo[e.tipo_extra || ""]
                                    }
                                    value={String(e.numero)}
                                    amount={e.monto_extra || 0}
                                    payments={pagosListExtra}
                                    onPrint={() => console.log("Print")}
                                    dateBottom
                                    printBottom
                                    dateBottomText={
                                        e.fecha_pago
                                            ? formatCustomDate(
                                                UTCStringToLocalDate(e.fecha_pago),
                                                "D MMM YYYY, hh:mm a"
                                            )
                                            : "-"
                                    }
                                />
                            )
                        })}
                    {experiencias.length > 0 && (
                        <ItemMultiplePayment
                            icon={"star"}
                            label="Experiencias"
                            className="detalle-h-items__multiple--experience"
                            payments={experiencias.map((exp) => ({
                                label: exp.experiencia?.nombre || "Experiencia",
                                amount: exp.total || 0,
                            }))}
                            showAmounts
                        />
                    )}

                    {/* Pagos de Room Service */}
                    {data?.habitacion?.ultima_renta?.ordenes
                        ?.filter(
                            (orden) =>
                                (orden.pago_id || (orden.pagos && orden.pagos.length > 0)) &&
                                orden.estado_orden !== EstadosOrdenHistorial.Cancelada
                        )
                        .map((o) => {
                            //  total  pagado (parcial o total)
                            const totalPagadoParcial =
                                o.pagos?.reduce((acc, p) => {
                                    const total = p.detalles_pago?.reduce((sum, d) => sum + (d.subtotal || 0), 0)
                                    return acc + (total || 0)
                                }, 0) || 0

                            const montoMostrar = o.pago_id ? o.total_con_iva || 0 : totalPagadoParcial

                            //fecha del último pago
                            const fechasPagos: string[] = []
                            if (o.pago?.fecha_pago) fechasPagos.push(o.pago.fecha_pago)
                            if (o.pagos?.length) {
                                o.pagos.forEach((p) => p.fecha_pago && fechasPagos.push(p.fecha_pago))
                            }

                            const ultimaFechaPago =
                                fechasPagos.length > 0
                                    ? new Date(Math.max(...fechasPagos.map((f) => new Date(f).getTime())))
                                    : null

                            const allDetallesPago =
                                o.pago?.detalles_pago && o.pago.detalles_pago.length > 0
                                    ? o.pago.detalles_pago
                                    : o.pagos?.flatMap((p) => p.detalles_pago || []) || []

                            const pagosAgrupados = o.pagos || []
                            const metodosAgrupados: string[] = []

                            pagosAgrupados.forEach((p) => {
                                const tiposUnicos = Array.from(new Set(p.detalles_pago?.map((d) => d.tipo_pago)))

                                if (tiposUnicos.length > 1) {
                                    //Pago mixto
                                    metodosAgrupados.push("Pago mixto")
                                } else if (tiposUnicos.length === 1) {
                                    const tipo = tiposUnicos[0]
                                    if (tipo === "love_points") {
                                        metodosAgrupados.push("Love points")
                                    } else {
                                        const d = p.detalles_pago?.[0]
                                        metodosAgrupados.push(getCardLabel(d, false))
                                    }
                                }
                            })

                            if (metodosAgrupados.length === 0 && allDetallesPago.length > 0) {
                                const tiposUnicos = Array.from(new Set(allDetallesPago.map((d) => d.tipo_pago)))
                                if (tiposUnicos.length > 1) {
                                    metodosAgrupados.push("Pago mixto")
                                } else {
                                    const tipo = tiposUnicos[0]
                                    if (tipo === "love_points") {
                                        metodosAgrupados.push("Love points")
                                    } else {
                                        const d = allDetallesPago[0]
                                        metodosAgrupados.push(getCardLabel(d, false))
                                    }
                                }
                            }

                            const metodosPagoFinal = Array.from(new Set(metodosAgrupados))

                            return (
                                <ItemPayment
                                    key={o.orden_id}
                                    withPrinter={false}
                                    icon="roomServiceCommand"
                                    label="Room Service"
                                    value={o.orden}
                                    amount={montoMostrar}
                                    payments={metodosPagoFinal}
                                    dateBottom
                                    printBottom
                                    dateBottomText={
                                        ultimaFechaPago
                                            ? formatCustomDate(
                                                UTCStringToLocalDate(ultimaFechaPago.toISOString()),
                                                "D MMM YYYY, hh:mm a"
                                            )
                                            : "-"
                                    }
                                />
                            )
                        })}

                    {(propinasRS > 0 || propinasEstancia > 0) && (
                        <ItemMultiplePayment
                            icon={"handCoin"}
                            label="Propinas"
                            className="detalle-h-items__multiple--propinas"
                            payments={[
                                ...(propinasEstancia > 0
                                    ? [
                                        {
                                            label: "Estancia",
                                            amount: propinasEstancia,
                                            date: data?.habitacion?.ultima_renta?.pagos?.[0]?.fecha_pago
                                                  ? formatCustomDate(
                                                      UTCStringToLocalDate(
                                                          data.habitacion.ultima_renta.pagos[0].fecha_pago
                                                      ),
                                                      "D MMM YYYY, hh:mm a"
                                                  )
                                                  : "",
                                        },
                                    ]
                                    : []),

                                ...(data?.habitacion?.ultima_renta?.ordenes
                                    ?.filter((o) => typeof o.propina?.total === "number" && o.propina.total > 0)
                                    .map((o) => ({
                                        label: "Room Service",
                                        amount: o.propina?.total || 0,
                                        date: o.fecha_registro
                                            ? formatCustomDate(
                                                UTCStringToLocalDate(o.fecha_registro),
                                                "D MMM YYYY, hh:mm a"
                                            )
                                            : "",
                                    })) || []),
                            ]}
                            showAmounts
                        />
                    )}
                </DrawerAccordion>

                <DrawerAccordion
                    title="Pagos pendientes"
                    isEmpty={totalPorPagar <= 0}
                    emptyDescription="No hay pagos pendientes"
                    emptyIcon={"coinsFill"}
                >
                    {estanciaPendiente > 0 && (
                        <ItemMultiplePayment
                            icon={"HotelFilled"}
                            label={"Estancia"}
                            className="detalle-h-items__multiple--estancia"
                            payments={[
                                {
                                    label: data?.habitacion?.tipo_habitacion?.nombre || "",
                                    amount: data?.habitacion?.ultima_renta?.tarifa?.costo_habitacion,
                                },
                            ]}
                        />
                    )}

                    {data?.habitacion?.ultima_renta?.extras
                        ?.filter((extra) => !extra.fecha_pago)
                        .map((extra) => (
                            <ItemPayment
                                withPrinter={false}
                                key={uuid()}
                                icon={mapTiposExtrasIcon[extra?.tipo_extra || ""]}
                                label={
                                    tipoAlojamiento === "motel" && extra.tipo_extra === TIPOS_EXTRAS.hospedaje
                                        ? "Estancia extra"
                                        : mapTiposExtrasTitulo[extra?.tipo_extra || ""]
                                }
                                value={extra?.numero + "" || ""}
                                amount={extra.monto_extra}
                                dateBottom
                                dateBottomText={
                                    extra?.fecha_pago
                                        ? formatCustomDate(
                                            UTCStringToLocalDate(extra.fecha_pago),
                                            "D MMM YYYY, hh:mm a"
                                        )
                                        : "-"
                                }
                            />
                        ))}

                    {ordenesPendientesState.length > 0 &&
                        ordenesPendientesState.map((orden) => {
                            const detalle = orden.detalle_pago_pre_cargado

                            const metodo = detalle ? `Depósito en garantía - ${getCardLabel(detalle)}` : ""

                            return (
                                <ItemPayment
                                    key={orden.orden_id}
                                    icon="roomServiceCommand"
                                    label="Room Service"
                                    value={String(orden.orden)}
                                    amount={orden.total_con_iva || 0}
                                    payments={metodo ? [metodo] : []}
                                    withPrinter={false}
                                    dateBottom
                                    printBottom
                                    dateBottomText={
                                        orden?.fecha_registro
                                            ? formatCustomDate(
                                                UTCStringToLocalDate(orden.fecha_registro),
                                                "D MMM YYYY, hh:mm a"
                                            )
                                            : "-"
                                    }
                                />
                            )
                        })}
                </DrawerAccordion>
            </div>

            <div className={totalPorPagar > 0 ? "room-detail--occupied__tab--payments__footer" : ""}>
                <div className="room-detail--occupied__tab--payments__divider"></div>
                <div className="room-detail__tab--payments__group">
                    <span className="room-detail__tab--payments--thin">Total pagado</span>
                    <span className="room-detail__tab--payments--bold">{formatCurrency(totalPagado)}</span>
                </div>
                <div className="room-detail__tab--payments__group">
                    <span className="room-detail__tab--payments--thin">Por pagar</span>
                    <span className="room-detail__tab--payments--bold">{formatCurrency(totalPorPagar)}</span>
                </div>
            </div>

            {canRegisterPayment && (
                <PrimaryButton
                    text={"Registrar pago"}
                    disabled={
                        rolName === RoleNames.roomService
                            ? ordenesPendientesState.length === 0 || totalPorPagar === 0
                            : totalPorPagar === 0
                    }
                    onClick={validateIsColabActive(() => {
                        if (totalPorPagar > 0 && (ordenesPendientesState.length > 0 || estanciaPendienteTotal > 0)) {
                            navigate(`/u/room-service/pago/${room.ultima_renta.renta_id}`, {
                                state: { origen: "Estancia" },
                            })
                        }
                    })}
                    style={{ marginBottom: "12px", position: "relative", bottom: 0 }}
                />
            )}
            {InactiveModal}
        </div>
    )
}

export default Payments
