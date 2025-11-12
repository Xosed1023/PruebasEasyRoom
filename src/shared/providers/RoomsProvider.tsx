import React, { ReactNode, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useTurnoActual } from "src/pages/home/room-detail/hooks/turnos"
import { RootState } from "src/store/store"
import { useProfile } from "../hooks/useProfile"
import { useQuery } from "@apollo/client"
import { useListenHabitacionesSubscription } from "src/gql/schema"
import { GET_ROOMS } from "src/pages/home/graphql/queries/rooms.query"
import { setTurn } from "src/store/turn/turnSlice"
import { setRooms, setRoomsDimensions } from "src/store/rooms/roomsSlice"
import { ROOMS_LENGTH_SKELETON } from "../constants/localStorage"
import { toggleRoomDetailsDrawer } from "src/store/navigation/navigationSlice"

const RoomsProvider = ({ children }: { children: ReactNode }) => {
    const dispatch = useDispatch()

    const { rooms, selectedRoom } = useSelector((root: RootState) => root.rooms)
    const turno = useTurnoActual()
    const { hotel_id, usuario_id } = useProfile()

    const { data: hotelesQueryData } = useQuery(GET_ROOMS, {
        variables: {
            hotel_id,
            usuario_id,
        },
        fetchPolicy: "no-cache",
    })

    const { data } = useListenHabitacionesSubscription({
        variables: {
            hotelIdFilter: hotel_id,
            usuario_id
        },
        fetchPolicy: "no-cache",
    })

    useEffect(() => {
        localStorage.setItem("turno", JSON.stringify(turno || "{}"))
        if (turno) {
            dispatch(setTurn({ nombre: turno?.nombre, turno_id: turno?.turno_id }))
        }
    }, [turno])

    useEffect(() => {
        if (!hotelesQueryData?.habitaciones) {
            return
        }
        dispatch(setRooms(hotelesQueryData?.habitaciones as any))
        localStorage.setItem(ROOMS_LENGTH_SKELETON, hotelesQueryData?.habitaciones?.length)
        dispatch(setRoomsDimensions({
            y: Math.max(...hotelesQueryData.habitaciones.map(h => h.posicion.x)),
            x: Math.max(...hotelesQueryData.habitaciones.map(h => h.posicion.y))
        }))
    }, [hotelesQueryData])

    useEffect(() => {
        if(data?.checkHabitaciones.some(h => h.habitacion_id === selectedRoom?.habitacion_id)) {
            dispatch(toggleRoomDetailsDrawer(false))
        }

        if (data?.checkHabitaciones) {
            const updatedRooms = rooms.map((r) => {
                const roomChanged = data?.checkHabitaciones?.find((chR) => r.habitacion_id === chR.habitacion_id)
                return roomChanged ? roomChanged : r
            })
            dispatch(setRooms(updatedRooms as any))
        }
    }, [data])
    return <>{children}</>
}

export default RoomsProvider
