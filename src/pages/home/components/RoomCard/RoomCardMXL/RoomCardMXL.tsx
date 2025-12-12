import "./RoomCardMXL.css"

import Available from "./sections/status/Available/Available"
import Occupied from "./sections/status/Occupied/Occupied"
import WalkingEntrance from "./sections/status/WalkingEntrance/WalkingEntrance"
import CarEntrance from "./sections/status/CarEntrance/CarEntrance"
import OccupiedCleaning from "./sections/status/OccupiedCleaning/OccupiedCleaning"
import Unclean from "./sections/status/Unclean/Unclean"
import RoomService from "./sections/status/RoomService/RoomService"
import Maintenance from "./sections/status/Maintenance/Maintenance"
import Blocked from "./sections/status/Blocked/Blocked"
import Reserved from "./sections/status/Reserved/Reserved"
import { RoomStatus } from "../enums/RoomStatus.enum"
import { RoomStatusProps } from "../interfaces/RoomStatusProps.interface"
import { useMemo } from "react"
import Cleaning from "./sections/status/Cleaning/Cleaning"
import Clean from "./sections/status/Clean/Clean"
import SupervisionPending from "./sections/status/SupervisionPending/SupervisionPending"
import Supervision from "./sections/status/Supervision/Supervision"

// RoomCard: encargada de elegir el tamaño de la card (xs, sm, md, lg y xl)
// RoomCardXS y similares: encargadas de elegir el status de acuerdo a su tamaño correspondiente
export const RoomCardMXL = ({ roomStatus, ...props }: RoomStatusProps) => {
    const selectStatus = (roomStatus: RoomStatus) => {
        switch (roomStatus) {
            case RoomStatus.available:
                return <Available {...props} />
            case RoomStatus.clean:
                return <Clean {...props} />
            case RoomStatus.occupied:
                // si tiene cleaningTimeStart puede haber sido una limpieza anterior, solo si aún no existe cleaningTimeSalida nos aseguramos de que es la limpieza actual
                if (props.cleaningTimeStart && !props.cleaningTimeSalida) {
                    return <OccupiedCleaning {...props} />
                }
                if (props.clientName) {
                    return <Occupied {...props} />
                }
                if (props.placas) {
                    return <CarEntrance {...props} />
                }
                return <WalkingEntrance {...props} />
            case RoomStatus.unclean:
                return <Unclean {...props} />
            case RoomStatus.supervision:
                return <Supervision {...props} />
            case RoomStatus.supervisionPending:
                return <SupervisionPending {...props} />
            case RoomStatus.roomService:
                return <RoomService {...props} />
            case RoomStatus.maintenance:
                return <Maintenance {...props} />
            case RoomStatus.blocked:
                return <Blocked {...props} />
            case RoomStatus.reserved:
                return <Reserved {...props} />
            case RoomStatus.cleaning:
                return <Cleaning {...props} />
            default:
                break
        }
    }

    const selectStatusMemo = useMemo(() => selectStatus(roomStatus), [
        roomStatus,
        ...[props]
    ],)

    return (
        <div
            className = {props.isSelected ? "room-card--mxl__container-select" : "room-card--mxl__container" }>
            {selectStatusMemo}
        </div>
    )
}

export default RoomCardMXL
