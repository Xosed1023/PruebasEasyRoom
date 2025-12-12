import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Screen from "src/shared/components/layout/screen/Screen"
import { useRoom } from "../../hooks"
import { useDispatch, useSelector } from "react-redux"
import { startGetSelectedRoom, startUpdateSelectedRoom } from "src/pages/home/store/thunks/rooms.thunk"
import { RoomStatus } from "src/pages/home/components/RoomCard/enums/RoomStatus.enum"

import "./FreeRoom.css"
import { toggleRoomDetailsDrawer } from "src/store/navigation/navigationSlice"
import useSnackbar from "src/shared/hooks/useSnackbar"
import { RootState } from "src/store/store"
import LayoutFree from "../../sections/layout-free/LayoutFree"
import { Estados_Habitaciones } from "src/gql/schema"
import { useDisponibilidadHabitacion } from "../../drawer/venta/hooks/useDisponibilidad"
import AlertaDisponibilidad from "../../Modals/AlertaDisponibilidad/AlertaDisponibilidad"
import useLoadingState from "src/shared/hooks/useLoadingState"

const FreeRoom = () => {
    const { habitacion_id = "" } = useParams()
    const room = useRoom()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { showSnackbar } = useSnackbar()
    const { myProfile } = useSelector((state: RootState) => state.profile)
    const { alerta_por_disponibilidad } = useDisponibilidadHabitacion()

    const [modalAlert, setModalAlert] = useState<boolean>(false)
    const { isLoadingDelayed, toggleIsLoading } = useLoadingState()

    useEffect(() => {
        dispatch(startGetSelectedRoom(habitacion_id))
    }, [])

    useEffect(() => {
        // si el estado es vacio probablemente viene de un refresh o de un back
        if (!room.estado) {
            return
        }
        // Si una habitacion no esta en limpia no deberia acceder a esta pag
        if (room.estado !== RoomStatus.clean) {
            return navigate("/u")
        }
    }, [room])

    const [freeState, setFreeState] = useState(RoomStatus.available)

    const closePage = () => {
        navigate("/u")
        dispatch(toggleRoomDetailsDrawer(false))
    }

    return (
        <Screen close={true} title="" onClose={() => closePage()}>
            <LayoutFree
                value={freeState}
                title={`¿Qué deseas hacer con la habitación ${room?.numero_habitacion}?`}
                options={[
                    {
                        label: "Poner a la venta",
                        icon: "moneyDollarCircleLine",
                        description: "Podrás hacer el check in en la habitación en cuanto decidas venderla.",
                        key: Estados_Habitaciones.ALaVenta,
                    },
                    {
                        label: "Vender la habitación",
                        icon: "BedFilled",
                        description: "Iniciar con proceso de venta de habitación.",
                        key: Estados_Habitaciones.Ocupada,
                    },
                ]}
                onChange={(value) => setFreeState(value)}
                onClick={() => {
                    if (!freeState || isLoadingDelayed) {
                        return
                    }
                    toggleIsLoading({ value: true })
                    if (freeState === RoomStatus.occupied) {
                        toggleIsLoading({ value: false })
                        alerta_por_disponibilidad
                            ? setModalAlert(true)
                            : navigate(`/u/venta-habitacion/${habitacion_id}`)
                        return
                    }
                    dispatch(
                        startUpdateSelectedRoom({
                            roomId: room.habitacion_id,
                            status: RoomStatus.available,
                            usuarioId: myProfile.usuario_id,
                            hotelId: myProfile.hotel?.[0]?.hotel_id || "",
                            onSuccess: () => {
                                toggleIsLoading({ value: false })
                                closePage()
                                showSnackbar({
                                    status: "success",
                                    title: "Habitación disponible para venta",
                                    text: `La habitación **${room.tipo_habitacion?.nombre} ${room.numero_habitacion}** pasó de **preparada a venta**`,
                                })
                            },
                        })
                    )
                }}
            />
            <AlertaDisponibilidad
                isOpen={modalAlert}
                onClose={() => setModalAlert(false)}
                onClick={() => navigate(`/u/venta-habitacion/${habitacion_id}`)}
            />
        </Screen>
    )
}

export default FreeRoom
