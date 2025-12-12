import { client } from "src/graphql"
import { RootState } from "src/store/store"
import { selectRoom, setRooms, updateRoom } from "../../../../store/rooms/roomsSlice"
import { RoomStatus } from "../../components/RoomCard/enums/RoomStatus.enum"
import { UPDATE_ROOM_STATUS } from "../../graphql/mutations/rooms.mutations"
import { GET_ROOM, GET_ROOMS } from "../../graphql/queries/rooms.query"
import { selectReservation } from "src/store/reservations/reservationsSlice"
import { toggleRoomDetailsDrawer } from "src/store/navigation/navigationSlice"
import { GET_LAST_RESERVATION_FROM_ROOM } from "../../graphql/queries/reservas"

export const startGetRooms = ({ onLoad }: { onLoad?: () => void }): any => {
    return async (dispatch: any, getState: () => RootState) => {
        try {
            const hotelId = sessionStorage.getItem("hotel_id") || getState().profile.hotel_id

            const { data } = await client.query({
                query: GET_ROOMS,
                variables: {
                    hotel_id: hotelId,
                    usuario_id: getState().profile.usuario_id,
                },
                fetchPolicy: "no-cache",
            })
            onLoad?.()
            dispatch(setRooms(data.habitaciones))
        } catch (error) {
            console.log(error)
            onLoad?.()
            dispatch(setRooms([]))
        }
    }
}

export const startGetSelectedRoom = (roomId: string, disabledToggle?: boolean, onLoad?: () => void): any => {
    return async (dispatch: any, getState: () => RootState) => {
        try {
            const { data } = await client.query({
                query: GET_ROOM,
                variables: {
                    habitacion_id: roomId,
                    usuario_id: getState().profile.usuario_id,
                    hotel_id: getState().profile.hotel_id,
                },
                fetchPolicy: "no-cache",
            })
            onLoad?.()
            dispatch(selectRoom(data.habitacion))
            if (!disabledToggle) dispatch(toggleRoomDetailsDrawer(true))
        } catch (error) {
            console.log(error)
        }
    }
}

export const startGetSelectedRoomFromToggle = (roomId: string, onLoad: () => void): any => {
    return async (dispatch: any, getState: () => RootState) => {
        try {
            const { data } = await client.query({
                query: GET_ROOM,
                variables: {
                    habitacion_id: roomId,
                    usuario_id: getState().profile.usuario_id,
                    hotel_id: getState().profile.hotel_id,
                },
                fetchPolicy: "no-cache",
            })
            dispatch(selectRoom(data.habitacion))
            dispatch(toggleRoomDetailsDrawer(true))
            onLoad()
        } catch (error) {
            console.log(error)
        }
    }
}

export const startGetLastReservation = (reserva_id?: string): any => {
    return async (dispatch: any, getState: () => RootState) => {
        try {
            if (!reserva_id) {
                return
            }
            const { data } = await client.query({
                query: GET_LAST_RESERVATION_FROM_ROOM,
                variables: {
                    reserva_id,
                },
                fetchPolicy: "no-cache",
            })
            dispatch(selectReservation(data?.reserva))
        } catch (error) {
            console.log(error)
        }
    }
}

export const startUpdateSelectedRoom = ({
    roomId,
    status,
    comentarioEstado = "",
    usuarioId,
    hotelId,
    onSuccess,
}: {
    roomId: string
    status: RoomStatus
    comentarioEstado?: string
    usuarioId: string
    hotelId: string
    onSuccess?: () => void
}): any => {
    return async (dispatch: any, getState: () => RootState) => {
        try {
            client
                .mutate({
                    mutation: UPDATE_ROOM_STATUS,
                    variables: {
                        actualizar_habitacion_estado_input: {
                            estado: status,
                            fecha_estado: new Date().toISOString(),
                            comentario_estado: comentarioEstado,
                            habitacion_id: roomId,
                            usuario_id: usuarioId,
                            hotel_id: hotelId
                        },
                    },
                })
                .then((data) => {
                    onSuccess?.()
                    dispatch(updateRoom(data?.data.actualizar_habitacion_estado))
                    dispatch(selectRoom(data?.data.actualizar_habitacion_estado))
                })
        } catch (error) {
            console.log(error)
        }
    }
}

export const startRefetchUpdatedRoom = (habitacion_id: string): any => {
    return async (dispatch: any, getState: () => RootState) => {
        try {
            const { data } = await client.query({
                query: GET_ROOM,
                variables: {
                    habitacion_id,
                    usuario_id: getState().profile.usuario_id,
                    hotel_id: getState().profile.hotel_id,
                },
            })
            dispatch(selectRoom(data.habitacion))
            dispatch(updateRoom(data.habitacion))
        } catch (error) {
            console.log(error)
        }
    }
}
