import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "src/store/store"
import { RoomStatus } from "src/pages/home/components/RoomCard/enums/RoomStatus.enum"
import { client } from "src/graphql"
import { GET_RENTAS, GET_MONTH_PERCENT } from "./rentas.graphql"
import { useProfile } from "src/shared/hooks/useProfile"
import { getSoldRoomsData, getBestSellingRoom, getNotCheckOutRentas, getTodayBookings } from "./helpers"
import { getPercent } from "./percent"
import { getExpectedPercent, getReachedPercent } from "./math"
import { useDate } from "src/shared/hooks/useDate"
import { useCurrentDateQuery } from "src/gql/schema"

export function useDataByOccupied() {
    const [rentas, setRentas] = useState<any[]>([])
    const [monthPercent, setMonthPercent] = useState<number>(0)
    const { data: currDate } = useCurrentDateQuery()

    const { hotel_id } = useProfile()
    const { getDayHoursRange, UTCStringToLocalDate } = useDate()
    const rooms = useSelector((state: RootState) => state.rooms.rooms)
    const occupiedRooms = rooms.filter(({ estado }) => estado === RoomStatus.occupied)

    //const todayRentas = getTodayRentas(rentas)
    const soldRooms = getSoldRoomsData(rentas, rooms.length)

    useEffect(() => {
        if (currDate?.serverDate) {
            const { fecha_final, fecha_inicial } = getDayHoursRange(UTCStringToLocalDate(currDate.serverDate))

            client
                .query({
                    query: GET_RENTAS,
                    variables: {
                        renta_id: [],
                        fecha_registro: {
                            fecha_inicial,
                            fecha_final,
                        },
                    },
                })
                .then(({ data }) => {
                    const rentas: any[] =
                        data?.rentas?.filter(({ habitacion }) => habitacion?.hotel_id === hotel_id) || []

                    setRentas(rentas)
                })
                .catch(console.log)
        }
    }, [currDate])

    const getOccupiedData = () => {
        if ((rentas?.length || 0) > 0) {
            const occupiedRoomsNotCheckOut = getNotCheckOutRentas(occupiedRooms)
            const todayBookings = getTodayBookings(rooms)

            const reachedPercent = getReachedPercent({
                occupiedRoomsNotCheckOut,
                bookingsWithCheck: soldRooms.reserva.number,
                localRentas: soldRooms.mostrador.number,
                rooms: rooms.length,
            })

            return {
                percent: getPercent(occupiedRooms.length, rooms.length),
                expectedPercent: getExpectedPercent({ occupiedRoomsNotCheckOut, todayBookings, rooms: rooms.length }),
                reachedPercent: reachedPercent,
            }
        } else {
            return {
                percent: 0,
                reachedPercent: 0,
                expectedPercent: 0,
            }
        }
    }

    const getDateMonth = (day: number) => {
        const date = new Date()
        return new Date(date.getFullYear(), date.getMonth(), day, 0, 0, 0, 0).toISOString()
    }

    const handleMonthPercent = () => {
        const fecha_inicial = getDateMonth(1)
        const fecha_final = getDateMonth(new Date().getDate())

        client
            .query({
                query: GET_MONTH_PERCENT,
                variables: {
                    fecha_inicial,
                    fecha_final,
                    hotel_id,
                },
            })
            .then(({ data }) => {
                if (data?.obtener_porcentaje_promedio_ocupacion) {
                    const number = Number(data?.obtener_porcentaje_promedio_ocupacion || 0)

                    setMonthPercent(Number(number.toFixed(2)))
                }
            })
            .catch(console.log)
    }

    return {
        getOccupiedData,
        getSoldRoomsData: () => soldRooms,
        getBestSellingRoom: () => getBestSellingRoom(rentas, rooms),
        handleMonthPercent,
        monthPercent,
    }
}
