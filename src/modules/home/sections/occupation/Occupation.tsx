import { Estados_Habitaciones, Renta, useCurrentDateQuery, useGetMonthPercentLazyQuery } from "@/gql/schema"
import SectionTitle from "../../../../components/core/layout/section-title/SectionTitle"
import ChartMini from "../../components/chart-mini/ChartMini"
import styles from "./Occupation.module.css"
import Tooltip from "./sections/Tooltip/Tooltip"
import { useEffect, useState } from "react"
import { dateHelpers } from "@/helpers/dateHelpers"
import { getNotCheckOutRentas } from "./helpers/getNotCheckoutRentas"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import { getTodayBookings } from "./helpers/getTodaysBookings"
import { getReachedPercent } from "./helpers/getReachedPercent"
import { getPercent } from "../../helpers/getPercent"
import { getExpectedPercent } from "./helpers/getExpectedPercent"
import { getSoldRoomsData } from "../../helpers/getSoldRoomsData"

const Occupation = ({hotel_id, rentas = []}: {hotel_id: string, rentas: Renta[]}) => {
    const { UTCStringToLocalDate } = dateHelpers()
    const { data } = useCurrentDateQuery()
    const { rooms } = useSelector((state: RootState) => state.rooms)
    const [getMonthPercent] = useGetMonthPercentLazyQuery()
    const soldRooms = getSoldRoomsData(rentas || [], rooms?.length || 0)

    const occupiedRooms = rooms?.filter(({ estado }) => estado === Estados_Habitaciones.Ocupada)

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
        const date = UTCStringToLocalDate(data?.serverDate)
        return new Date(date.getFullYear(), date.getMonth(), day, 0, 0, 0, 0).toISOString()
    }

    const [monthPercent, setmonthPercent] = useState(0)
    const handleMonthPercent = async () => {
        const fecha_inicial = getDateMonth(1)
        const fecha_final = getDateMonth(UTCStringToLocalDate(data?.serverDate).getDate())

        return getMonthPercent({
            variables: {
                    fecha_inicial,
                    fecha_final,
                    hotel_id,
                }
        })
            .then(({ data }) => {
                if (data?.obtener_porcentaje_promedio_ocupacion) {
                    const number = Number(data?.obtener_porcentaje_promedio_ocupacion || 0)
                    
                    setmonthPercent(Number(number.toFixed(2)))
                }
            })
            .catch(console.log)
    }

    useEffect(() => {
        handleMonthPercent()
    }, [hotel_id])
    

    const {expectedPercent, percent, reachedPercent} = getOccupiedData()
    
    return (
        <>
            <SectionTitle title="Ocupación">
                <Tooltip />
            </SectionTitle>
            <div className="flex gap-x-[20px] justify-between w-full">
                <ChartMini
                    title="Mensual"
                    dataKey="mensual"
                    limit={100}
                    value={Number(monthPercent.toFixed(2))}
                    color="var(--primary)"
                    bgClass="first:fill-(--fondo-close)"
                />
                <ChartMini
                    title="Al momento"
                    limit={100}
                    value={Number(percent.toFixed(2))}
                    dataKey="moment"
                    color="var(--disponible)"
                    bgClass="first:fill-(--disponible2)"
                />
            </div>
            <div className={styles.label}>
                <span className={styles["label__title"]}>Esperada</span>
                <span className={styles["label__value"]}>{expectedPercent}%</span>
            </div>
            <div className={styles.label}>
                <span className={styles["label__title"]}>Alcanzada</span>
                <span className={styles["label__value"]}>{reachedPercent}%</span>
            </div>
        </>
    )
}

export default Occupation
