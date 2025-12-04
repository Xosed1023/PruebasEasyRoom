import { Habitacion, useGetHabitacionesQuery, useListenHabitacionesSubscription } from "@/gql/schema"
import { useEffect, useState } from "react"

const useRooms = ({ hotel_id }: { hotel_id: string }) => {
    const { data: rooms, loading: loadingRooms } = useGetHabitacionesQuery({
        variables: {
            hotelIdFilter: hotel_id,
        },
    })
    const { data: roomChange } = useListenHabitacionesSubscription({
        variables: {
            hotelIdFilter: hotel_id,
        },
    })

    const [roomsList, setroomsList] = useState<Habitacion[]>([])
    

    useEffect(() => {
        setroomsList((rooms?.habitaciones as Habitacion[]) || [])
    }, [rooms])

    useEffect(() => {
        const updatedRooms = rooms?.habitaciones?.map((r) => {
            const roomChanged = roomChange?.checkHabitaciones?.find((chR) => r.habitacion_id === chR.habitacion_id)
            return roomChanged ? roomChanged : r
        })
        setroomsList(updatedRooms as Habitacion[])
    }, [roomChange])

    return {
        rooms: roomsList,
         loading:  loadingRooms,
    }
}

export default useRooms
