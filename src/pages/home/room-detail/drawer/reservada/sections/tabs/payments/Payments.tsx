import React, { useEffect, useState } from "react"
import { v4 as uuid } from "uuid"

import "./Payments.css"
import { PrimaryButton, Title } from "src/pages/home/room-detail/sections/elements/Elements"
import DescriptionDetail from "src/shared/components/data-display/description-detail/DescriptionDetail"
import { useSelector } from "react-redux"
import { RootState } from "src/store/store"
import { useGetReservacionByIdQuery } from "src/gql/schema"
import { useDate } from "src/shared/hooks/useDate"
import { minus, sum, times } from "src/shared/helpers/calculator"
import { RegisterPay } from "src/pages/reservaciones/inicio/components/RegisterPay/RegisterPay"
import Pago from "src/pages/reservaciones/reservaciones/drawer/asignacion-reservaciones-tab-pago/sections/Pago/Pago"
import { formatCurrency } from "src/shared/hooks/formatCurrency"
import { getCardLabel } from "src/shared/sections/payment/helpers/card"
import { isVisibleCardOrReference } from "src/shared/sections/payment/Payment.helpers"
import { formatText } from "src/shared/hooks/formatTextOpcions"
import { useProfile } from "src/shared/hooks/useProfile"
import { ItemMultiplePayment } from "src/pages/home/room-detail/sections/items/Items"
import useIsColaboradorActive from "src/shared/hooks/useIsColaboradorActive"
import { RoleNames } from "src/shared/hooks/useAuth"

const Payments = ({ isNoShow }: { isNoShow: boolean }) => {
    const { reservaSeleccionada } = useSelector((root: RootState) => root.roomDetails.reservada)

    const { diffDays } = useDate()
    const { rolName } = useProfile()
    const { InactiveModal, validateIsColabActive } = useIsColaboradorActive()

    const { data, refetch } = useGetReservacionByIdQuery({
        variables: {
            id: reservaSeleccionada?.reserva_id || "",
        },
    })
    const [reservaActualizada, setReservaActualizada] = useState<any>()
    const [totalPorPagar, setTotalPorPagar] = useState(0)

    useEffect(() => {
        setReservaActualizada(data?.reservas[0])
    }, [data])

    useEffect(() => {
        setTotalPorPagar(
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

    const { UTCStringToLocalDate } = useDate()
    const [isRegistrarPagoModalOpen, setisRegistrarPagoModalOpen] = useState(false)

    return (
        <div className="tab__reservada__payments__container">
            <div className="tab__reservada__payments__list">
                <Title>Resumen de compra</Title>
                <DescriptionDetail
                    label="Habitación"
                    value={reservaActualizada?.habitacion.tipo_habitacion?.nombre || ""}
                    amount={
                        (reservaActualizada?.tarifa?.costo_habitacion || 1) *
                        diffDays(
                            UTCStringToLocalDate(reservaActualizada?.fecha_entrada),
                            UTCStringToLocalDate(reservaActualizada?.fecha_salida)
                        )
                    }
                    icon="BedFilled"
                    style={{
                        width: "100%",
                        padding: "12px 0",
                    }}
                />
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
                        diffDays(
                            UTCStringToLocalDate(reservaActualizada?.fecha_entrada),
                            UTCStringToLocalDate(reservaActualizada?.fecha_salida)
                        )
                    )}
                />
                {!!reservaActualizada?.experiencias_reserva?.length && (
                    <ItemMultiplePayment
                        showAmounts={true}
                        icon={"star"}
                        label={"Experiencias"}
                        style={{
                            width: "100%",
                            padding: "12px 0 ",
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
                <Title>Pagos</Title>
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
            <div>
                <div className="room-detail--occupied__tab--payments__footer">
                    <div className="tab__reservada__payments__divider"></div>
                    <div className="room-detail__tab--payments__group">
                        <span className="room-detail__tab--payments--thin">Total de cuenta</span>
                        <span className="room-detail__tab--payments--bold">
                            {formatCurrency(reservaActualizada?.total || 0)}
                        </span>
                    </div>
                    <div className="room-detail__tab--payments__group">
                        <span className="room-detail__tab--payments--thin">Total pagado</span>
                        <span className="room-detail__tab--payments--bold">
                            {formatCurrency(
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
                        </span>
                    </div>
                    <div className="room-detail__tab--payments__group">
                        <span className="room-detail__tab--payments--thin">Por pagar</span>
                        <span className="room-detail__tab--payments--bold">{formatCurrency(totalPorPagar)}</span>
                    </div>
                </div>
                {rolName !== RoleNames.valet && rolName !== RoleNames.monitoreo && totalPorPagar > 0 && (
                    <PrimaryButton
                        text="Registrar pago"
                        disabled={isNoShow}
                        onClick={validateIsColabActive(() => setisRegistrarPagoModalOpen(true))}
                    />
                )}
            </div>
            {InactiveModal}
        </div>
    )
}

export default Payments
