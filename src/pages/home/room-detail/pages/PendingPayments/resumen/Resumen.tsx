import DescriptionDetail from "src/shared/components/data-display/description-detail/DescriptionDetail"

import "./Resumen.css"
import Detail from "./sections/Detail"
import { PrimaryButton } from "src/pages/home/room-detail/sections/elements/Elements"
import { useNavigate } from "react-router-dom"
import { useRoom, useRoomStore } from "src/pages/home/room-detail/hooks"
import useSnackbar from "src/shared/hooks/useSnackbar"
import { Habitacion } from "src/gql/schema"
import { useDate } from "src/shared/hooks/useDate"
import { formatCurrency } from "src/shared/hooks/formatCurrency"
import { FormValues } from "../PendingPayments"
import { useMutation } from "@apollo/client"
import { PAGAR_EXTRAS } from "src/pages/home/graphql/mutations/pagos"
import { useFormContext } from "react-hook-form"
import { useProfile } from "src/shared/hooks/useProfile"
import { TicketPaymentMethods } from "./sections/Ticket"

const Resumen = ({
    habitacion,
    totalPorPagar = 0,
    setTotalIvaPorPagar = 0,
    pagosList,
}: {
    habitacion?: Habitacion
    totalPorPagar?: number
    setTotalIvaPorPagar?: number
    pagosList: FormValues
}) => {
    const navigate = useNavigate()
    const room = useRoom()
    const { handleFinishPage } = useRoomStore()
    const { UTCStringToLocalDate, formatLongDate } = useDate()
    const { watch } = useFormContext()
    const { usuario_id, hotel_id } = useProfile()

    const pago = watch()
    const { showSnackbar } = useSnackbar()

    const [pagarExtras] = useMutation(PAGAR_EXTRAS)

    const confirmPagarExtras = () => {
        pagarExtras({
            variables: {
                pagar_renta_input: {
                    extra_id: habitacion?.ultima_renta?.extras?.filter((e) => !e.fecha_pago)?.map((e) => e.extra_id),
                    renta_id: habitacion?.ultima_renta?.renta_id,
                    pago: {
                        detallesPago: pago.extra.map((detalle) => ({
                            subtotal: detalle?.amount,
                            tipo_pago: detalle?.type,
                            ultimos_digitos: detalle?.number.length ? detalle?.number : null,
                        })),
                        hotel_id: hotel_id,
                        total: pago.costs?.general || 0,
                        usuario_id: usuario_id,
                    },
                    usuario_id: usuario_id,
                },
            },
        })
            .then(() => {
                showSnackbar({
                    title: "Pago registrado",
                    text: `Se registró un **Pago de ${formatCurrency(totalPorPagar)}** para la habitación **${
                        room?.tipo_habitacion?.nombre
                    } ${room.numero_habitacion}**`,
                    status: "success",
                })
            })
            .catch(() =>
                showSnackbar({
                    text: "¡Ups! Se ha producido un error, Por favor, inténtalo nuevamente",
                    title: "Error al registrar pago",
                    status: "error",
                })
            )
            .finally(() => {
                navigate(`/u`)
                handleFinishPage()
            })
    }

    return (
        <div className="room-detail__page--pending-payments-resumen">
            <div className="room-detail__page--pending-payments-resumen__title__wrapper">
                <span className="room-detail__page--pending-payments-resumen__title">Resumen</span>
            </div>
            <DescriptionDetail
                darkMode
                className="room-detail__page--pending-payments__item"
                icon="calendarFill"
                label="Fecha de la estancia"
                value={
                    habitacion?.ultima_renta?.fecha_registro
                        ? `
                        ${formatLongDate(
                            UTCStringToLocalDate(habitacion?.ultima_renta?.fecha_registro),
                            false
                        )} - ${formatLongDate(UTCStringToLocalDate(habitacion?.ultima_renta?.fecha_fin), false)}`
                        : "-"
                }
            />
            <DescriptionDetail
                darkMode
                className="room-detail__page--pending-payments__item"
                icon="MoonFill"
                label="Noches extras"
                value={String(habitacion?.ultima_renta?.hospedajes_extra || "-")}
            />
            <DescriptionDetail
                darkMode
                className="room-detail__page--pending-payments__item"
                icon="Clock"
                label="Horas extras"
                value={String(habitacion?.ultima_renta?.horas_extra || "-")}
            />
            <DescriptionDetail
                darkMode
                className="room-detail__page--pending-payments__item"
                icon="UserParentFill"
                label="Personas extras"
                value={String(habitacion?.ultima_renta?.personas_extra || "-")}
            />
            <DescriptionDetail
                darkMode
                className="room-detail__page--pending-payments__item"
                icon="roomServiceCommand"
                label="Órdenes de room service"
                value={String(habitacion?.ultima_renta?.ordenes?.length || "-")}
            />
            <TicketPaymentMethods />
            <div className="room-detail__page--pending-payments__divider"></div>
            <div className="room-detail__page--pending-payments__total--item">
                <Detail label="Impuestos" value={formatCurrency(setTotalIvaPorPagar)} />
            </div>
            <div className="room-detail__page--pending-payments__total--last">
                <span className="room-detail__page--pending-payments__total--last__text">Por pagar</span>
                <span className="room-detail__page--pending-payments__total--last__text">{formatCurrency(totalPorPagar)}</span>
            </div>
            <PrimaryButton
                text="Registrar pago"
                onClick={() => {
                    if (!pagosList.extra.length) {
                        return
                    }
                    confirmPagarExtras()
                }}
            />
        </div>
    )
}

export default Resumen
