import React from "react"
import { RoomStatusProps } from "../../../../interfaces/RoomStatusProps.interface"
import RoomCardBody from "../../shared/RoomCardBody/RoomCardBody"
import RoomCardHeader from "../../shared/RoomCardHeader/RoomCardHeader"
import Wrapper from "../../shared/Wrapper/Wrapper"

import "./Maintenance.css"
import { useFilterTipoMantenimiento } from "src/shared/providers/TiposMantenimientoProvider"

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
                <span className="room-card--xs--maintenance__timer">{tipoMantenimiento.clave}</span>
                <span className="room-card--xs--maintenance__description">{maintenanceColaboradorName}</span>
            </RoomCardBody>
        </Wrapper>
    )
}

export default Maintenance
