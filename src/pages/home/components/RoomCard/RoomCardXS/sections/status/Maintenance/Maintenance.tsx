import React from "react"
import { RoomStatusProps } from "../../../../interfaces/RoomStatusProps.interface"
import RoomCardBody from "../../shared/RoomCardBody/RoomCardBody"
import RoomCardHeader from "../../shared/RoomCardHeader/RoomCardHeader"
import Wrapper from "../../shared/Wrapper/Wrapper"

import "./Maintenance.css"
import { useFilterTipoMantenimiento } from "src/shared/providers/TiposMantenimientoProvider"
import { useMaxWidthContext } from "../../../hooks/useMaxWidth"
import { useSelector } from "react-redux"
import { RootState } from "src/store/store"

// TODO fecha en que inicio la tarea de mantenimiento
const Maintenance = ({
    roomNumber,
    roomTypeName,
    dateStatusChanged,
    room,
    maintenanceColaboradorName,
    maintenanceDetails,
    hasIncidences,
}: RoomStatusProps) => {
    const { tipoMantenimiento } = useFilterTipoMantenimiento({ size: "xs", name: maintenanceDetails || "" })
    const { maxWidth } = useMaxWidthContext()

    
    const { roomsDimensions } = useSelector((state: RootState) => state.rooms)
        
    const itemHeight = `calc(calc(80dvh - 240px) / ${(roomsDimensions?.x || 1) * 4})`;

    return (
        <Wrapper bgColor={"var(--supervision-card)"}>
            <RoomCardHeader
                roomNumber={roomNumber}
                hasIncidences={hasIncidences}
                iconBgColor="var(--mantenimiento)"
                roomTypeAbbreviation={roomTypeName?.[0]}
                iconName="tools"
            ></RoomCardHeader>
            <RoomCardBody>
                <div className="room-card--xs--maintenance__description_wrapper" style={{ maxWidth }}>
                    <span className="room-card--xs--maintenance__timer" style={{fontSize: itemHeight}}>{tipoMantenimiento.clave}</span>
                    <span className="room-card--xs--maintenance__description" style={{fontSize: itemHeight}}>{maintenanceColaboradorName}</span>
                </div>
            </RoomCardBody>
        </Wrapper>
    )
}

export default Maintenance
