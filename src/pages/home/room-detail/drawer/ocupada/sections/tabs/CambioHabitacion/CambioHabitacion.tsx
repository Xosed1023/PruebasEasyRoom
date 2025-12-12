import React, { useState } from "react"
import { Block, PrimaryButton } from "src/pages/home/room-detail/sections/elements/Elements"
import { ListView } from "src/pages/home/room-detail/sections/views/Views"
import DescriptionDetail from "src/shared/components/data-display/description-detail/DescriptionDetail"
import RoomTabs from "src/shared/components/data-display/room-tabs/RoomTabs"

import "./CambioHabitacion.css"
import { useRoom } from "src/pages/home/room-detail/hooks"
// import RoomServiceActive from "src/pages/home/room-detail/Modals/RoomServiceActive/RoomServiceActive"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "src/store/store"
import { useDate } from "src/shared/hooks/useDate"
import { Estados_Habitaciones, useCambiarRentaDeHabitacionMutation } from "src/gql/schema"
import useMiniSnackbar from "src/shared/hooks/useMiniSnackbar"
import { useTimePulse } from "src/shared/hooks/useTimePulse"
import { formatDiffTimeLong } from "src/shared/helpers/formatDiffTimeLong"
import { useProfile } from "src/shared/hooks/useProfile"
import { toggleRoomDetailsDrawer } from "src/store/navigation/navigationSlice"
import { useCloseDrawer } from "src/pages/home/room-detail/helpers/useCloseDrawer"
import LoaderComponent from "src/shared/components/layout/loader/Loader"
import useAuth, { RoleNames } from "src/shared/hooks/useAuth"
import AuthRequiredModal from "src/pages/inventario/modals/Auth/AuthRequiredModal/AuthRequiredModal"

const CambioHabitacion = () => {
    const room = useRoom()

    // TODO: Room service en 1.2
    // const [isRoomServiceActiveModalOpen, setIsRoomServiceActiveModalOpen] = useState(false)
    const { rooms } = useSelector((state: RootState) => state.rooms)
    const { usuario_id } = useProfile()
    const dispatch = useDispatch()

    const [now] = useTimePulse()

    const [cambiarRentaDeHabitacion] = useCambiarRentaDeHabitacionMutation()
    const [iscambioHabitacionLoading, setIsCambioHabitacionLoading] = useState(false)

    const { showMiniSnackbar } = useMiniSnackbar()
    const { closeDrawer } = useCloseDrawer(() => {
        setIsCambioHabitacionLoading(false)
    })

    const [roomSelected, setRoomSelected] = useState<
        | {
              habitacion_id: string
              tipo_habitacion: string
              numero_habitacion: string
              renta_id: string
          }
        | undefined
    >()
    const { getHoursPassedSince, UTCStringToLocalDate } = useDate()

    const onConfirmCambioRentaDeHabitacion = () => {
        if (!roomSelected || iscambioHabitacionLoading) {
            return
        }
        setIsCambioHabitacionLoading(true)
        cambiarRentaDeHabitacion({
            variables: {
                datos_renta: {
                    habitacion_id: roomSelected?.habitacion_id || "",
                    renta_id: room?.ultima_renta?.renta_id || "",
                    usuario_id,
                },
            },
        })
            .then(() => {
                showMiniSnackbar({
                    title: "Cambio de habitación",
                    status: "success",
                    text: `Se realizó el cambio de la habitación **${room?.tipo_habitacion?.nombre} ${room?.numero_habitacion}** a la habitación **${roomSelected?.tipo_habitacion} ${roomSelected?.numero_habitacion}.** El room service se entregará a la nueva habitación`,
                })
            })
            .catch(() => {
                showMiniSnackbar({
                    title: "Error al reasignar habitación",
                    status: "error",
                    text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente",
                })
            })
            .finally(() => {
                dispatch(toggleRoomDetailsDrawer(false))
                closeDrawer()
            })
    }

    const [isAuthModalOpen, setisAuthModalOpen] = useState(false)
    const { Modal, skip } = useAuth({
        authModal: (
            <AuthRequiredModal
                isOpen={isAuthModalOpen}
                onAuthFilled={(value, sampleData) => {
                    onConfirmCambioRentaDeHabitacion()
                    setisAuthModalOpen(false)
                }}
                onClose={() => setisAuthModalOpen(false)}
            />
        ),
        authorizedRoles: [RoleNames.recepcionista, RoleNames.admin, RoleNames.superadmin],
        isOpen: isAuthModalOpen,
        onClose: () => setisAuthModalOpen(false),
    })

    return (
        <ListView title="Cambio de habitación">
            <Block list scroll className="">
                <DescriptionDetail
                    icon="building4Fill"
                    label="Habitación actual"
                    style={{
                        width: "100%",
                    }}
                    value={`${room?.tipo_habitacion?.nombre} ${room?.numero_habitacion}`}
                />
                <DescriptionDetail
                    icon="calendarFill"
                    label="Estancia restante"
                    style={{
                        width: "100%",
                    }}
                    value={formatDiffTimeLong(now, UTCStringToLocalDate(room?.ultima_renta?.fecha_fin))}
                />
                <h2 className="tab__cambio-habitacion__description">
                    Elige una de las siguientes habitaciones preparadas para realizar el cambio
                </h2>
                <div className="tab__cambio-habitacion__rooms-description">
                    <span>Habitación preparada</span>
                    <span>Última asignación</span>
                </div>
                <div className="tab__cambio-habitacion__rooms">
                    <RoomTabs
                        items={rooms
                            .filter(
                                (r) =>
                                    r?.tipo_habitacion_id === room.tipo_habitacion_id &&
                                    (r?.estado === Estados_Habitaciones.Preparada ||
                                        r?.estado === Estados_Habitaciones.ALaVenta)
                            )
                            .map((r) => ({
                                label: r?.numero_habitacion,
                                timer:
                                    getHoursPassedSince(UTCStringToLocalDate(r?.ultima_renta?.fecha_registro)) +
                                    " horas",
                                value: r?.habitacion_id,
                            }))}
                        onChange={(v) => {
                            const r = rooms.find((roomToFind) => roomToFind.habitacion_id === v)
                            setRoomSelected({
                                habitacion_id: r?.habitacion_id || "",
                                numero_habitacion: r.numero_habitacion || "",
                                tipo_habitacion: r?.tipo_habitacion?.nombre || "",
                                renta_id: r?.ultima_renta?.renta_id || "",
                            })
                        }}
                        style={{}}
                        value={roomSelected?.habitacion_id || ""}
                    />
                </div>
            </Block>
            {/* <RoomServiceActive
                isOpen={isRoomServiceActiveModalOpen}
                onClose={() => setIsRoomServiceActiveModalOpen(false)}
            /> */}
            <PrimaryButton
                text="Cambio de habitación"
                disabled={!roomSelected}
                onClick={() => {
                    if (skip) {
                        onConfirmCambioRentaDeHabitacion()
                    }
                    setisAuthModalOpen(true)
                }}
            />
            {Modal}
            <LoaderComponent visible={iscambioHabitacionLoading} />
        </ListView>
    )
}

export default CambioHabitacion
