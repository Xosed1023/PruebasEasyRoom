import React, { useEffect, useState } from "react"
import DescriptionDetail from "src/shared/components/data-display/description-detail/DescriptionDetail"

import "./Resumen.css"
import DetailBold from "./sections/DetailBold"
import Detail from "./sections/Detail"
import { PrimaryButton } from "src/pages/home/room-detail/sections/elements/Elements"
import { useNavigate } from "react-router-dom"
import { useDate } from "src/shared/hooks/useDate"
import { formatCurrency } from "src/shared/hooks/formatCurrency"
import { ModalConfirm } from "src/shared/components/layout"
import Icon from "src/shared/icons"
import { Habitacion, TiposAlojamientos } from "src/gql/schema"
import IconBorder from "src/shared/components/data-display/IconBorder/IconBorder"
import useSnackbar from "src/shared/hooks/useSnackbar"

const Resumen = ({
    habitacion,
    estancia,
    roomDays = 1,
    impuestosEstancia,
    roomSerice,
    impuestoRoomService,
    numOrdenesRoomService,
    totalEstancia,
    tipoAlojamiento,
    totalImpuestos,
    totalPagado,
    pagosPendientes,
    hospedajesExtra,
    personasExtra,
    montoPersonasExtra,
    habitacion_id,
    totalCheckInAnticipado,
    propina,
    montoTotalBebidas,
    montoTotalAlimentos,
    montoTotalSexAndSpa,
}: {
    habitacion?: Habitacion
    estancia: number
    roomDays: number
    numOrdenesRoomService: number
    tipoAlojamiento: TiposAlojamientos
    impuestosEstancia: number
    roomSerice: number
    impuestoRoomService: number
    totalEstancia: number
    totalImpuestos: number
    totalPagado: number
    pagosPendientes?: number
    habitacion_id: string
    hospedajesExtra?: number
    totalCheckInAnticipado?: number
    propina: number
    montoTotalBebidas: number
    montoTotalAlimentos: number
    montoTotalSexAndSpa: number
    personasExtra: number,
    montoPersonasExtra: number,
}) => {
    const navigate = useNavigate()

    const [nocheONoches, setNocheONoches] = useState("")

    useEffect(() => {
        if (tipoAlojamiento === TiposAlojamientos.Motel) {
            setNocheONoches("")
            return
        }
        if (roomDays > 1) {
            setNocheONoches(`(${roomDays} noches)`)
            return
        }
        setNocheONoches(`(${roomDays} noche)`)
    }, [roomDays, tipoAlojamiento])

    const [isModalPagosPendientesOpen, setIsModalPagosPendientesOpen] = useState(false)
    const { showSnackbar } = useSnackbar()

    const { UTCStringToLocalDate, formatLongDate } = useDate()
    return (
        <div className="room-detail__page--checkout-resumen">
            <div className="room-detail__page--checkout-main">
                <div className="room-detail__page--checkout-header">
                    <span className="room-detail__page--checkout-resumen__title">Resumen</span>
                </div>
                <div className="room-detail__page--checkout-body">
                    {!!habitacion?.ultima_renta?.nombre_huesped && (
                        <DescriptionDetail
                            darkMode
                            className="room-detail__page--checkout__item"
                            icon="userFilled"
                            label="Nombre completo del huésped"
                            value={habitacion?.ultima_renta?.nombre_huesped || "-"}
                        />
                    )}
                    <DescriptionDetail
                        darkMode
                        className="room-detail__page--checkout__item"
                        icon="UserThinFilled"
                        label="Total de personas"
                        value={
                            (habitacion?.ultima_renta?.numero_personas || 0) +
                            (habitacion?.ultima_renta?.personas_extra || 0) +
                            ""
                        }
                    />
                    {!!habitacion?.ultima_renta?.reserva?.origen && (
                        <DescriptionDetail
                            darkMode
                            className="room-detail__page--checkout__item"
                            icon="BusinessGlobalFill"
                            label="Origen de la reserva"
                            value={habitacion?.ultima_renta?.reserva?.origen || "-"}
                        />
                    )}
                    <DescriptionDetail
                        darkMode
                        className="room-detail__page--checkout__item"
                        icon="calendarFill"
                        label="Fecha de la estancia"
                        value={
                            habitacion?.ultima_renta?.fecha_registro
                                ? `${formatLongDate(
                                    UTCStringToLocalDate(habitacion?.ultima_renta?.fecha_registro),
                                    false
                                )} - ${formatLongDate(
                                    UTCStringToLocalDate(habitacion?.ultima_renta?.fecha_condensada),
                                    false
                                )}`
                                : "-"
                        }
                    />
                    {!!hospedajesExtra && (
                        <DescriptionDetail
                            darkMode
                            className="room-detail__page--checkout__item"
                            icon="MoonFill"
                            label="Noches extras"
                            value={(hospedajesExtra || 0) + ""}
                        />
                    )}
                    {numOrdenesRoomService > 0 && (
                        <DescriptionDetail
                            darkMode
                            className="room-detail__page--checkout__item"
                            icon="roomServiceCommand"
                            label="Órdenes de room service"
                            value={String(numOrdenesRoomService) || "0"}
                        />
                    )}
                </div>
            </div>
            <div className="room-detail__page--checkout-footer">
                <div className="room-detail__page--checkout__divider"></div>
                <div className="room-detail__page--checkout__total--item">
                    <DetailBold label={`Estancia ${nocheONoches}`} value={formatCurrency(estancia)} />
                </div>
                {!!totalCheckInAnticipado && (
                    <div className="room-detail__page--checkout__total--item">
                        <DetailBold label="Check-in anticipado" value={formatCurrency(totalCheckInAnticipado)} />
                    </div>
                )}
                {!!personasExtra && (
                    <div className="room-detail__page--checkout__total--item">
                        <DetailBold label={`Personas extra (${personasExtra})`} value={formatCurrency(montoPersonasExtra)} />
                    </div>
                )}
                <div className="room-detail__page--checkout__total--item">
                    {!!roomSerice && (
                        <DetailBold
                            label={`Room service (${numOrdenesRoomService} orden${roomSerice > 1 ? "es" : ""})`}
                            value={`${formatCurrency(roomSerice)}`}
                        />
                    )}
                </div>
                <div className="room-detail__page--checkout__total--item">
                    <DetailBold label="Total de estancia" value={formatCurrency(totalEstancia)} />
                    <Detail label="Impuestos" value={formatCurrency(totalImpuestos)} />
                </div>
                <div className="room-detail__page--checkout__total--item">
                    <DetailBold label="Propina" value={formatCurrency(propina)} />
                </div>
                <div className="room-detail__page--checkout__total--item">
                    <DetailBold label="Total pagado" value={formatCurrency(totalPagado)} />
                </div>
                <div className="room-detail__page--checkout__total--last">
                    <span className="room-detail__page--checkout__total--last__text">Total a pagar</span>
                    <span className="room-detail__page--checkout__total--last__text">
                        {formatCurrency(pagosPendientes || 0)}
                    </span>
                </div>
                <div className="room-detail__page--checkout__divider" style={{ width: "400px" }}></div>
                <PrimaryButton
                    text="Confirmar check out"
                    style={{ marginTop: "14px", height: "40px" }}
                    onClick={() => {
                        if ((pagosPendientes || 0) > 0) {
                            setIsModalPagosPendientesOpen(true)
                            return
                        }
                        showSnackbar({
                            title: "Checkout completado",
                            status: "success",
                            text: `La habitación **${habitacion?.tipo_habitacion?.nombre} ${habitacion?.numero_habitacion}** ha sido liberada por los huéspedes`,
                        })
                        navigate(`/u/detalle-habitacion/end-checkout/${habitacion_id}`, {
                            state: {
                                montoTotalBebidas,
                                montoTotalAlimentos,
                                montoTotalSexAndSpa,
                            },
                        })
                    }}
                />
            </div>
            <ModalConfirm
                icon={
                    <IconBorder primaryBgDiameter={24} primaryBgColor="var(--green-available)">
                        <Icon name="building4Fill" color="var(--white)" height={14} width={14} />
                    </IconBorder>
                }
                iconTheme="success"
                title="Pagos pendientes"
                confirmLabel="Ver pendientes"
                isOpen={isModalPagosPendientesOpen}
                description={
                    <>
                        <p className="room-detail__page--modal--confirm">
                            La habitación{" "}
                            <span className="room-detail__page--modal--confirm--bold">
                                {habitacion?.tipo_habitacion?.nombre} {habitacion?.numero_habitacion}
                            </span>{" "}
                            tiene pagos pendientes por un total de{" "}
                            <span className="room-detail__page--modal--confirm--bold">
                                {formatCurrency(pagosPendientes || 0)}
                            </span>
                        </p>
                    </>
                }
                onCloseDialog={({ confirmed }) => {
                    setIsModalPagosPendientesOpen(false)
                    if (!confirmed) {
                        return
                    }
                    navigate(`/u/detalle-habitacion/pending-payments/${habitacion_id}`)
                }}
            />
        </div>
    )
}

export default Resumen
