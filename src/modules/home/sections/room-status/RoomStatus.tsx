import Check from "@/icons/Check"
import Card from "../../components/card/Card"
import RoomStatusItem from "../../components/room-status-item/RoomStatusItem"
import { RoomStatusItemProps } from "../../components/room-status-item/RoomStatusItem.type"
import DollarSign from "@/icons/DollarSign"
import BedFill from "@/icons/BedFill"
import ThrashCan from "@/icons/ThrashCan"
import Broom from "@/icons/Broom"
import Tools from "@/icons/Tools"
import CalendarFill from "@/icons/CalendarFill"
import LockFill from "@/icons/LockFill"
import SectionTitle from "../../../../components/core/layout/section-title/SectionTitle"
import useRooms from "./hooks/useRooms"
import classifyRooms from "./helpers/classifyRooms"
import { useEffect } from "react"
import { setRooms } from "@/store/rooms/roomsSlice"
import { useDispatch } from "react-redux"
import SearchWatch from "@/icons/SearchWatch"

const RoomStatus = ({hotel_id}: {hotel_id: string}) => {
    const {rooms, loading} = useRooms({hotel_id})
    const dispatch = useDispatch()
    useEffect(() => {
        if(rooms) {
            dispatch(setRooms(rooms))
        }
    }, [rooms])
    

    const {roomsGroups} = classifyRooms({rooms: rooms || []})
    
    const roomsStatus: RoomStatusItemProps[] = [
        {
            icon: <Check width={15} height={15} color="var(--white)" />,
            iconColor: "var(--disponible)",
            title: "Preparada",
            value: roomsGroups.preparada,
        },
        {
            icon: <DollarSign width={15} height={15} color="var(--white)" />,
            iconColor: "var(--disponible)",
            title: "A la venta",
            value: roomsGroups.a_la_venta,
        },
        {
            icon: <BedFill width={15} height={15} color="var(--white)" />,
            iconColor: "var(--ocupada)",
            title: "Ocupada",
            value: roomsGroups.ocupada,
        },
        {
            icon: <ThrashCan width={15} height={15} color="var(--white)" />,
            iconColor: "var(--sucia)",
            title: "Sucia",
            value: roomsGroups.sucia,
        },
        {
            icon: <Broom width={15} height={15} color="var(--white)" />,
            iconColor: "var(--limpieza)",
            title: "Limpieza",
            value: roomsGroups.limpieza,
        },
        {
            icon: <Tools width={15} height={15} color="var(--white)" />,
            iconColor: "var(--mantenimiento)",
            title: "Mantenimiento",
            value: roomsGroups.mantenimiento,
        },
        {
            icon: <CalendarFill width={15} height={15} color="var(--white)" />,
            iconColor: "var(--reservada)",
            title: "Reservada",
            value: roomsGroups.reservada,
        },
        {
            icon: <LockFill width={15} height={15} color="var(--white)" />,
            iconColor: "var(--bloqueada)",
            title: "Bloqueada",
            value: roomsGroups.bloqueada,
        },
        {
            icon: <SearchWatch width={15} height={15} color="var(--white)" />,
            iconColor: "var(--supervision)",
            title: "Pendiente de supervisión",
            value: roomsGroups.supervision_pendiente,
        },
    ]

    return (
        <>
            <SectionTitle title="Estatus de habitaciones" />
            <Card className="flex flex-col gap-y-[20px]">
                {roomsStatus.map((r) => (
                    <RoomStatusItem key={r.title} icon={r.icon} iconColor={r.iconColor} title={r.title} value={r.value} loading={loading} />
                ))}
            </Card>
        </>
    )
}

export default RoomStatus
