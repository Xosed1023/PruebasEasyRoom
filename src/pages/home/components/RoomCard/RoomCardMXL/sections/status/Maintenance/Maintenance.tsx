import React from "react"
import Icon from "src/shared/icons"
import RoomCardBody from "../../shared/RoomCardBody/RoomCardBody"
import RoomCardFooter from "../../shared/RoomCardFooter/RoomCardFooter"
import RoomCardHeader from "../../shared/RoomCardHeader/RoomCardHeader"
import Wrapper from "../../shared/Wrapper/Wrapper"

import "./Maintenance.css"
import { RoomStatusProps } from "../../../../interfaces/RoomStatusProps.interface"
import { useFilterTipoMantenimiento } from "src/shared/providers/TiposMantenimientoProvider"

const Maintenance = ({
    roomTypeName,
    roomNumber,
    room,
    maintenanceColaboradorName,
    maintenanceColaboradorPhotoUrl,
    maintenanceDetails,
    hasIncidences,
}: Omit<RoomStatusProps, "roomStatus">) => {
    const { tipoMantenimiento } = useFilterTipoMantenimiento({ size: "xs", name: maintenanceDetails || "" })

    return (
        <Wrapper bgColor={"var(--supervision-card)"}>
            <RoomCardHeader
                hasIncidences={hasIncidences}
                iconName="tools"
                iconBgColor="var(--mantenimiento)"
                roomNumber={roomNumber}
                roomTypeName={roomTypeName}
            />
            <RoomCardBody verticalAlign="start">
                <div className="room-card--mxl-maintenance__icon--wrapper">
                    {maintenanceColaboradorPhotoUrl ? (
                        <img src={maintenanceColaboradorPhotoUrl} className="room-card--mxl-maintenance__icon--photo" />
                    ) : (
                        <Icon name="userFilled" color="var(--deep-dark-gray)" height={12} width={12} />
                    )}
                </div>
                <span className="room-card--mxl-maintenance__name">{maintenanceColaboradorName}</span>
                <span className="room-card--mxl-maintenance__timer">{tipoMantenimiento.clave}</span>
            </RoomCardBody>
            <RoomCardFooter text="Limpiar habitación" bgColor={"var(--white-transparent)"} />
        </Wrapper>
    )
}

export default Maintenance
