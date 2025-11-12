import Drawer from "src/shared/components/layout/drawer/Drawer"

import { DrawerSectinProps } from "../../Inicio.types"
import { selectDrawerSection } from "src/store/reservations/reservationsSlice"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "src/store/store"

import { DetailSection } from "./sections/DetailSection/DetailSection"
import { useEffect, useState } from "react"
import AsignacionReservacion from "src/pages/reservaciones/reservaciones/drawer/asignacion-reservacion/AsignacionReservacion"
import { RoomSection } from "./sections/RoomSection/RoomSection"
import { useCloseDrawer } from "src/pages/reservaciones/helpers/useCloseDrawer"
import CancelarReserva from "src/pages/home/room-detail/Modals/CancelarReserva/CancelarReserva"
import LoaderComponent from "src/shared/components/layout/loader/Loader"
import { EstadosReservas, useCancelarReservaMutation } from "src/gql/schema"
import { useProfile } from "src/shared/hooks/useProfile"
import { usePrintTicket } from "src/shared/hooks/print"
import useSnackbar from "src/shared/hooks/useSnackbar"

export function DrawerSection({ visible = false, onClose = undefined, id }: DrawerSectinProps): JSX.Element {
    const { drawerSelectedSection, selectedReservation } = useSelector((state: RootState) => state.reservations)
    const dispatch = useDispatch()
    const { usuario_id, rolName } = useProfile()

    const [asignada, setAsignada] = useState<boolean>()

    useEffect(() => {
        setAsignada(selectedReservation?.habitacion_id !== null ? true : false || false)
    }, [selectedReservation])

    const [isCancelarReserevaModalOpen, setIsCancelarReserevaModalOpen] = useState<boolean>(false)
    const [isCancelarReservaLoading, setIsCancelarReservaLoading] = useState(false)
    const [cancelarReserva] = useCancelarReservaMutation()
    const { closeDrawer } = useCloseDrawer(() => {
        setIsCancelarReservaLoading(false)
    })
    const { showSnackbar } = useSnackbar()
    const { handlePrint } = usePrintTicket()

    return (
        <>
            <Drawer
                placement={"right"}
                bar={false}
                visible={visible}
                withMenu={selectedReservation?.estado === EstadosReservas.SinAsignar && rolName !== "MANTENIMIENTO"}
                itemsMenu={[
                    {
                        label: "Cancelar reserva",
                        onClick: () => setIsCancelarReserevaModalOpen(true),
                    },
                ]}
                withCloseButton={true}
                onClose={onClose}
                withBackButton={
                    drawerSelectedSection === "rooms" || drawerSelectedSection === "selectedRoomToAssignReservation"
                }
                onBack={() =>
                    dispatch(
                        selectDrawerSection(
                            drawerSelectedSection === "rooms"
                                ? "detail"
                                : drawerSelectedSection === "selectedRoomToAssignReservation"
                                ? "rooms"
                                : "detail"
                        )
                    )
                }
            >
                {drawerSelectedSection === "detail" || drawerSelectedSection === "payments" ? (
                    <DetailSection asignada={asignada} sentReservaD={selectedReservation} />
                ) : drawerSelectedSection === "selectedRoomToAssignReservation" ? (
                    <AsignacionReservacion sentReservaD={selectedReservation} />
                ) : drawerSelectedSection === "rooms" ? (
                    <RoomSection sentReservaD={selectedReservation} />
                ) : null}
            </Drawer>
            {selectedReservation && (
                <CancelarReserva
                    isOpen={isCancelarReserevaModalOpen}
                    title="Cancelación de reserva"
                    onClose={() => setIsCancelarReserevaModalOpen(false)}
                    onCancelError={() => {
                        showSnackbar({
                            title: "Error al cancelar reserva",
                            status: "error",
                            text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                        })
                    }}
                    onConfirm={(data, cb) => {
                        setIsCancelarReservaLoading(true)
                        cancelarReserva({
                            variables: {
                                cancelar_reserva_input: {
                                    monto_devuelto_cancelacion: data.presupuesto,
                                    motivo_cancelacion: data.otroMotivoCancelacion || data.motivoCancelacion,
                                    reserva_id: selectedReservation.reserva_id,
                                    usuario_id: usuario_id,
                                },
                                codigo: data.codigo || "",
                                template_sample: data.template_sample || "",
                            },
                        })
                            .then((data) => {
                                const ticket_id = data?.data?.cancelar_reserva.ticket_ids || []
                                ticket_id.map((ticket) => {
                                    handlePrint(ticket, "original")
                                })
                                showSnackbar({
                                    title: "Reservación cancelada",
                                    status: "success",
                                    text: `La reserva **${selectedReservation.folio}** se canceló`,
                                })
                            })
                            .catch(() => {
                                showSnackbar({
                                    title: "Error al cancelar reserva",
                                    text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                                    status: "error",
                                })
                            })
                            .finally(() => {
                                cb?.()
                                closeDrawer()
                            })
                    }}
                />
            )}
            <LoaderComponent visible={isCancelarReservaLoading} />
        </>
    )
}
