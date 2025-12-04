import Card from "../../components/card/Card"
import GaugeChartSales from "../../components/gauge-chart-sales/GaugeChartSales"
import SalesItem from "../../components/sales-item/SalesItem"
import SectionTitle from "../../../../components/core/layout/section-title/SectionTitle"

import styles from './RoomSales.module.css'
import Tooltip from "./sections/Tooltip/Tooltip"
import { Renta } from "@/gql/schema"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import { getSoldRoomsData } from "../../helpers/getSoldRoomsData"

const RoomSales = ({rentas = []}: {rentas: Renta[]}) => {
    const rooms = useSelector((state: RootState) => state.rooms.rooms)

    const { rooms: soldRooms, mostrador, reserva, acumulada } = getSoldRoomsData(rentas, rooms?.length || 0)
    
    return (
        <>
            <SectionTitle title="Venta de habitaciones">
                <Tooltip />
            </SectionTitle>
            <Card>
                <GaugeChartSales total={soldRooms} mostrador={mostrador.number} reserva={reserva.number} />
                <SalesItem
                    dotClass="bg-(--sucia)"
                    percentage={mostrador.percent}
                    title="Mostrador"
                    items={[
                        { name: "A pie", value: mostrador.pie },
                        { name: "Auto", value: mostrador.coche },
                    ]}
                />
                <SalesItem
                    dotClass="bg-(--ocupada)"
                    percentage={reserva.percent}
                    title="Reserva"
                    items={[
                        { name: "A pie", value: reserva.pie },
                        { name: "Auto", value: reserva.coche },
                    ]}
                />
                <div className="flex justify-between mt-[15px]">
                    <span className={styles["room-sales__total__label"]}>Venta Acumulada</span>
                    <span className={styles["room-sales__total__title"]}>{acumulada}%</span>
                </div>
            </Card>
        </>
    )
}

export default RoomSales
