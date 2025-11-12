import { useEffect, useState } from "react"
import "./CancelButton.css"
import useSnackbar from "src/shared/hooks/useSnackbar"
import { useProfile } from "src/shared/hooks/useProfile"
import { useCloseDrawer } from "src/pages/reservaciones/helpers/useCloseDrawer"
import LoaderComponent from "src/shared/components/layout/loader/Loader"
import { SecondaryButton } from "src/pages/home/room-detail/sections/elements/Elements"
import { useCancelarReservaMutation, useGetReservacionByIdLazyQuery } from "src/gql/schema"
import { usePrintTicket } from "src/shared/hooks/print"
import CancelarReserva, { CancelReservaData } from "src/pages/home/room-detail/Modals/CancelarReserva/CancelarReserva"
import useIsColaboradorActive from "src/shared/hooks/useIsColaboradorActive"

export const CancelButton = ({ id, codigo, corteId }: { id: string; codigo: string; corteId: string }) => {
    const [visible, setVisible] = useState<boolean>(false)
    const [codigoOTA, setCodigoOTA] = useState<string>("")
    const { usuario_id } = useProfile()
    const [cancelarReserva] = useCancelarReservaMutation()
    const [getReserva] = useGetReservacionByIdLazyQuery()
    const { handlePrint } = usePrintTicket()
    const {InactiveModal, validateIsColabActive} = useIsColaboradorActive()

    const { showSnackbar } = useSnackbar()

    const [isCancelarReservaLoading, setIsCancelarReservaLoading] = useState(false)
    const { closeDrawer } = useCloseDrawer(() => {
        setIsCancelarReservaLoading(false)
    })

    const onConfirmCancel = (data: CancelReservaData, cb?: () => void) => {
        if (isCancelarReservaLoading) {
            return
        }
        setIsCancelarReservaLoading(true)
        setVisible(false)
        cancelarReserva({
            variables: {
                cancelar_reserva_input: {
                    monto_devuelto_cancelacion: data.presupuesto || null,
                    motivo_cancelacion: data.otroMotivoCancelacion || data.motivoCancelacion,
                    reserva_id: id,
                    usuario_id: usuario_id,
                },
                codigo: String(data.codigo),
                template_sample: data.template_sample
            },
        })
            .then((data) => {
                const ticket_id = data?.data?.cancelar_reserva?.ticket_ids
                if (ticket_id) {
                    ticket_id.map((ticket) => {
                        handlePrint(ticket, "original")
                    })
                }
                showSnackbar({
                    status: "success",
                    title: "Reserva cancelada",
                    text: `La reserva **${codigo}** ha sido cancelada exitosamente. Puedes consultar el detalle en el historial de reservas.`,
                })
            })
            .catch(() => {
                showSnackbar({
                    title: "Error al cancelar la reserva",
                    text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                    status: "error",
                })
            })
            .finally(() => {
                cb?.()
                closeDrawer()
            })
    }

    useEffect(() => {
        if (id) {
            getReserva({
                variables: {
                    id: [id],
                },
            }).then((data) => {
                setCodigoOTA(data.data?.reservas?.[0].codigo_ota || "")
            })
        }
    }, [id])

    return (
        <>
            <CancelarReserva
                onConfirm={onConfirmCancel}
                isOpen={visible}
                title="Cancelación de reservación"
                subtitle={(codigoOTA && codigoOTA + " / ") + `ER-${codigo.toString().padStart(3, "0")}`}
                ota={codigoOTA ? true : false}
                onClose={() => setVisible(false)}
            />
            <SecondaryButton
                theme={"secondary"}
                className="reservas-screen__drawer__link"
                text={"Cancelar reservación"}
                onClick={validateIsColabActive(() => (corteId !== "" ? null : setVisible(true)))}
                style={{ opacity: corteId !== "" ? 0.5 : 1, cursor: corteId !== "" ? "auto" : "pointer" }}
            />
            <LoaderComponent visible={isCancelarReservaLoading} />
            {InactiveModal}
        </>
    )
}
