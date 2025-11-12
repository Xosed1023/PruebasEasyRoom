import React from "react"
import { RoomStatusProps } from "../../../../interfaces/RoomStatusProps.interface"
import RoomCardHeader from "../../shared/RoomCardHeader/RoomCardHeader"
import VerticalContainer from "../../shared/VerticalContainer/VerticalContainer"
import Wrapper from "../../shared/Wrapper/Wrapper"

import "./Maintenance.css"
import { useFilterTipoMantenimiento } from "src/shared/providers/TiposMantenimientoProvider"

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
                hasIncidences={hasIncidences}
                iconName={"tools"}
                roomNumber={roomNumber}
                roomTypeName={roomTypeName}
                iconBgColor="var(--mantenimiento)"
            />
            <VerticalContainer>
                <div className="room-card--md--maintenance__timer">{tipoMantenimiento.clave}</div>
                <div className="room-card--md--maintenance__description">{maintenanceColaboradorName}</div>
            </VerticalContainer>
        </Wrapper>
    )
}

export default Maintenance
