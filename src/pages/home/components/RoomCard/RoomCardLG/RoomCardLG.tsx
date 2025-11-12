import React from 'react'
import { RoomStatus } from '../enums/RoomStatus.enum'
import { RoomStatusProps } from '../interfaces/RoomStatusProps.interface'

import './RoomCardLG.css'
import Available from './sections/status/Available/Available'
import Blocked from './sections/status/Blocked/Blocked'
import CarEntrance from './sections/status/CarEntrance/CarEntrance'
import Maintenance from './sections/status/Maintenance/Maintenance'
import Occupied from './sections/status/Occupied/Occupied'
import OccupiedCleaning from './sections/status/OccupiedCleaning/OccupiedCleaning'
import Reserved from './sections/status/Reserved/Reserved'
import RoomService from './sections/status/RoomService/RoomService'
import Unclean from './sections/status/Unclean/Unclean'
import WalkingEntrance from './sections/status/WalkingEntrance/WalkingEntrance'
import Cleaning from './sections/status/Cleaning/Cleaning'
import Clean from './sections/status/Clean/Clean'
import SupervisionPending from './sections/status/SupervisionPending/SupervisionPending'
import Supervision from './sections/status/Supervision/Supervision'

const RoomCardLG = (props: RoomStatusProps) => {
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
    return (
        <div className="room-card--lg__container">
            <div className={props.isSelected ? "room-card--lg-select" : "room-card--lg"}>
                {selectStatus(props.roomStatus)}
            </div>
        </div>
    )
}

export default RoomCardLG