import { useEffect, useRef } from "react"
import { RoomStatus } from "../enums/RoomStatus.enum"
import { RoomStatusProps } from "../interfaces/RoomStatusProps.interface"

import "./RoomCardXS.css"
import Available from "./sections/status/Available/Available"
import Blocked from "./sections/status/Blocked/Blocked"
import Cleaning from "./sections/status/Cleaning/Cleaning"
import Maintenance from "./sections/status/Maintenance/Maintenance"
import Occupied from "./sections/status/Occupied/Occupied"
import OccupiedCleaning from "./sections/status/OccupiedCleaning/OccupiedCleaning"
import Reserved from "./sections/status/Reserved/Reserved"
import RoomService from "./sections/status/RoomService/RoomService"
import Unclean from "./sections/status/Unclean/Unclean"
import Clean from "./sections/status/Clean/Clean"
import SupervisionPending from "./sections/status/SupervisionPending/SupervisionPending"
import Supervision from "./sections/status/Supervision/Supervision"

const RoomCardXS = (props: RoomStatusProps) => {
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
                return <Occupied {...props} />
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

    const cardRef = useRef<HTMLDivElement>(null)

    //Establece el borde cuando la habitación está seleccionada y lo actualiza si cambia el estado.
    useEffect(() => {
        const applySelectedRoomBorder = () => {
            if (props.isSelected && cardRef.current?.firstChild) {
                (cardRef.current.firstChild as HTMLDivElement).style.border = "2px solid #7A83A0"
            } else if (cardRef.current?.firstChild) {
                (cardRef.current.firstChild as HTMLDivElement).style.border = ""
            }
        }

        applySelectedRoomBorder()

        //Crea un observador para detectar cambios en los elementos hijos y aplicar el borde.
        const observer = new MutationObserver(() => {
            applySelectedRoomBorder()
        })

        if (cardRef.current) {
            observer.observe(cardRef.current, { childList: true })
        }

        return () => observer.disconnect()
    }, [props.isSelected])

    return (
        <div
            className="room-card--xs__container"
            ref={cardRef}
        >
            {selectStatus(props.roomStatus)}
        </div>
    )
}

export default RoomCardXS
