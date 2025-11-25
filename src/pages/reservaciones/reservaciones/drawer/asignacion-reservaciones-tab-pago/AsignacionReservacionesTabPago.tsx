import React, { useEffect, useState } from "react"
import { RegisterPay } from "src/pages/reservaciones/inicio/components/RegisterPay/RegisterPay"
import { v4 as uuid } from "uuid"

import "./AsignacionReservacionesTabPago.css"
import LabelFlexLines from "./sections/LabelFlexLines"
import {
    EstadosReservas,
    GetReservacionesTableQuery,
    TiposAlojamientos,
    useGetReservacionByIdQuery,
} from "src/gql/schema"
import { PrimaryButton, Title } from "src/pages/home/room-detail/sections/elements/Elements"
import DescriptionDetail from "src/shared/components/data-display/description-detail/DescriptionDetail"
import { minus, sum, times } from "src/shared/helpers/calculator"
import Pago from "./sections/Pago/Pago"
import { useDate } from "src/shared/hooks/useDate"
import { formatCurrency } from "src/shared/hooks/formatCurrency"
import { useIVA } from "src/shared/hooks/useIVA"
import { formatText } from "src/shared/hooks/formatTextOpcions"
import { getCardLabel } from "src/shared/sections/payment/helpers/card"
import { isVisibleCardOrReference } from "src/shared/sections/payment/Payment.helpers"
import { ItemMultiplePayment } from "src/pages/home/room-detail/sections/items/Items"
import { useProfile } from "src/shared/hooks/useProfile"
import useIsColaboradorActive from "src/shared/hooks/useIsColaboradorActive"
import { RoleNames } from "src/shared/hooks/useAuth"

const AsignacionReservacionesTabPago = ({
    sentReservaD,
}: {
    sentReservaD: GetReservacionesTableQuery["reservas"][0]
}) => {
    const { data, refetch } = useGetReservacionByIdQuery({
        variables: {
            id: sentReservaD.reserva_id,
        },
    })
    const {InactiveModal, validateIsColabActive} = useIsColaboradorActive()
    const [reservaActualizada, setReservaActualizada] = useState<any>()
    const { rolName } = useProfile()
    const isMaintenance = rolName === RoleNames.mantenimiento
    const { diffDays, UTCStringToLocalDate, setHHMMSS } = useDate()

    const [diasAlojamiento, setdiasAlojamiento] = useState(1)
    useEffect(() => {
        setReservaActualizada(data?.reservas[0])
    }, [data])

    const [now, setNow] = useState(new Date())
    const [isNoShow, setIsNoShow] = useState(false)

    const [totalPorPagar, settotalPorPagar] = useState(0)

    useEffect(() => {
        setNow(new Date())
        setIsNoShow(
            now.getTime() >
                setHHMMSS({
                    startDate: UTCStringToLocalDate(sentReservaD.fecha_salida),
                    newHour: sentReservaD?.tarifa?.hora_checkin || "",
                }).getTime() +
                    60 * 1000
        )
        settotalPorPagar(
            minus(
                reservaActualizada?.total || 0,
                sum(
                    reservaActualizada?.pagos?.flatMap((p) => {
                        return (
                            p.detalles_pago?.map((detallePago) => {
                                return detallePago?.subtotal || 0
                            }) || [0]
                        )
                    }) || [0]
                )
            )
        )
    }, [reservaActualizada])

    useEffect(() => {
        setdiasAlojamiento(
            reservaActualizada?.tarifa?.tipo_alojamiento === TiposAlojamientos.Hotel
                ? diffDays(
                    UTCStringToLocalDate(reservaActualizada?.fecha_entrada),
                    UTCStringToLocalDate(reservaActualizada?.fecha_salida)
                ) || 1
                : 1
        )
    }, [reservaActualizada])

    const { getIVA } = useIVA()
    const [isRegistrarPagoModalOpen, setisRegistrarPagoModalOpen] = useState(false)

    return (
        <div className="asignacion__reservaciones__drawer__tab__pay">
            <div
                className="asignacion__reservaciones__drawer__tab__pay__top"
                style={{
                    height: isNoShow || totalPorPagar <= 0 ? "calc(100dvh - 435px)" : "calc(100dvh - 480px)",
                }}
            >
                <h5 className="asignacion__reservaciones__drawer__tab__title">Resumen de compra</h5>
                <DescriptionDetail
                    label="Habitación"
                    value={reservaActualizada?.tarifa?.nombre || ""}
                    amount={diasAlojamiento * (reservaActualizada?.tarifa?.costo_habitacion || 0)}
                    icon="BedFilled"
                    style={{
                        width: "100%",
                        padding: "12px 0",
                    }}
                />
                {reservaActualizada?.personas_extras > 0 && (
                    <DescriptionDetail
                        label="Personas extra"
                        value={reservaActualizada?.personas_extras + "" || ""}
                        icon="UserParentFill"
                        style={{
                            width: "100%",
                            padding: "12px 0",
                        }}
                        amount={times(
                            times(
                                reservaActualizada?.personas_extras || 0,
                                reservaActualizada?.tarifa?.costo_persona_extra || 0
                            ),
                            diasAlojamiento
                        )}
                    />
                )}
                {!!reservaActualizada?.experiencias_reserva?.length && (
                    <ItemMultiplePayment
                        showAmounts={true}
                        icon={"star"}
                        label={"Experiencias"}
                        style={{
                            width: "102%",
                            padding: "12px 0",
                        }}
                        className="detalle-h-items__multiple--experience"
                        labelClass="detalle-h-items__multiple__text--experience"
                        payments={
                            reservaActualizada?.experiencias_reserva?.map((s) => ({
                                label: s.experiencia?.nombre || "",
                                amount: s.total ?? 0,
                            })) || []
                        }
                    />
                )}
                <Title>Pagos registrados</Title>
                <div className="asignacion__reservaciones__drawer__tab__pay__info">
                    {isRegistrarPagoModalOpen && (
                        <RegisterPay
                            id={reservaActualizada.reserva_id || ""}
                            onClose={() => {
                                refetch()
                                setisRegistrarPagoModalOpen(false)
                            }}
                        />
                    )}
                    {reservaActualizada?.pagos?.map((p) => {
                        return p?.detalles_pago?.map((detallePago) => {
                            return (
                                <Pago
                                    key={uuid()}
                                    date={UTCStringToLocalDate(p.fecha_pago)}
                                    isCard={isVisibleCardOrReference(detallePago?.tipo_pago)}
                                    payType={formatText(detallePago.tipo_pago)}
                                    total={detallePago.subtotal}
                                    ultimos_digitos={getCardLabel(detallePago)}
                                    parcialPay={detallePago.subtotal === reservaActualizada?.total ? false : true}
                                    type={detallePago.tipo_pago || ""}
                                />
                            )
                        })
                    })}
                </div>
            </div>
            <div className="asignacion__reservaciones__drawer__tab__pay__total">
                <div className="asignacion__reservaciones__drawer__tab__pay__total__divider"></div>
                <LabelFlexLines
                    label1={`Estancia (${(reservaActualizada?.hospedajes_extra ?? 0) + 1})`}
                    label2={
                        reservaActualizada?.experiencias_reserva?.length > 0
                            ? `Experiencias (${reservaActualizada?.experiencias_reserva?.length ?? 0})`
                            : "Experiencias"
                    }
                    label3="Impuestos"
                    value1={formatCurrency(diasAlojamiento * (reservaActualizada?.tarifa?.costo_habitacion || 0))}
                    value2={
                        reservaActualizada && reservaActualizada.experiencias_reserva
                            ? formatCurrency(
                                reservaActualizada.experiencias_reserva.reduce(
                                    (total, experiencia) => total + (experiencia?.total || 0),
                                    0
                                )
                            )
                            : formatCurrency(0)
                    }
                    value3={formatCurrency(
                        getIVA(diasAlojamiento * (reservaActualizada?.tarifa?.costo_habitacion || 0))
                    )}
                />
                <LabelFlexLines
                    label1={`Personas extra x${reservaActualizada?.personas_extras}`}
                    label2="Impuesto"
                    value1={formatCurrency(
                        times(
                            times(
                                reservaActualizada?.personas_extras || 0,
                                reservaActualizada?.tarifa?.costo_persona_extra || 0
                            ),
                            diasAlojamiento
                        )
                    )}
                    value2={formatCurrency(
                        getIVA(
                            times(
                                times(
                                    reservaActualizada?.personas_extras || 0,
                                    reservaActualizada?.tarifa?.costo_persona_extra || 0
                                ),
                                diasAlojamiento
                            )
                        )
                    )}
                />
                <div className="asignacion__reservaciones__drawer__tab__pay__total__divider"></div>
                <LabelFlexLines
                    label1="Total de cuenta"
                    value1={formatCurrency(reservaActualizada?.total || 0)}
                    style={{ fontWeight: 700 }}
                />
                {reservaActualizada?.estado === EstadosReservas.Cancelada && (
                    <LabelFlexLines
                        label1="Total de pagos"
                        value1={formatCurrency(
                            sum(
                                reservaActualizada?.pagos?.flatMap((p) => {
                                    return (
                                        p?.detalles_pago?.map((detallePago) => {
                                            return detallePago?.subtotal || 0
                                        }) || [0]
                                    )
                                }) || [0]
                            )
                        )}
                        style={{ fontWeight: 700 }}
                    />
                )}
                {reservaActualizada?.estado === EstadosReservas.Cancelada ? (
                    <LabelFlexLines
                        label1="Devolución"
                        value1={formatCurrency(reservaActualizada?.monto_devuelto_cancelacion || 0)}
                        style={{ fontWeight: 700, fontSize: "20px" }}
                    />
                ) : (
                    <LabelFlexLines
                        label1="Por pagar"
                        value1={formatCurrency(totalPorPagar)}
                        style={{ fontWeight: 700, fontSize: "20px" }}
                    />
                )}
                {!isMaintenance && !isNoShow && totalPorPagar > 0 &&  reservaActualizada?.estado !== EstadosReservas.Cancelada && (
                    <PrimaryButton onClick={validateIsColabActive(() => setisRegistrarPagoModalOpen(true))} text="Registrar pago" />
                )}
            </div>
            {InactiveModal}
        </div>
    )
}

export default AsignacionReservacionesTabPago
