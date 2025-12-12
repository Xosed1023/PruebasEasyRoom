import React from "react"
import Icon from "src/shared/icons"
import RoomCardBody from "../../shared/RoomCardBody/RoomCardBody"
import RoomCardFooter from "../../shared/RoomCardFooter/RoomCardFooter"
import RoomCardHeader from "../../shared/RoomCardHeader/RoomCardHeader"
import Wrapper from "../../shared/Wrapper/Wrapper"

import "./Maintenance.css"
import { useDispatch } from "react-redux"
import { toggleRoomDetailsDrawer } from "src/store/navigation/navigationSlice"
import { selectMaintenanceSection } from "src/store/roomDetails/maintenance.Slice"
import { RoomStatusProps } from "../../../../interfaces/RoomStatusProps.interface"
import { useFilterTipoMantenimiento } from "src/shared/providers/TiposMantenimientoProvider"

const Maintenance = ({
    roomTypeName,
    roomNumber,
    dateStatusChanged,
    maintenanceColaboradorName,
    hasIncidences,
    maintenanceColaboradorPhotoUrl,
    room,
    maintenanceDetails,
}: Omit<RoomStatusProps, "roomStatus">) => {
    const dispatch = useDispatch()
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
                <div className="room-card--xl-maintenance__icon--wrapper">
                    {maintenanceColaboradorPhotoUrl ? (
                        <img
                            src={maintenanceColaboradorPhotoUrl}
                            className="room-card--xl-occupied-cleaning__icon--photo"
                        />
                    ) : (
                        <Icon name="userFilled" color="var(--deep-dark-gray)" height="20px" />
                    )}
                </div>
                <span className="room-card--xl-maintenance__name">{maintenanceColaboradorName}</span>
                <span className="room-card--xl-maintenance__timer">{tipoMantenimiento.clave}</span>
            </RoomCardBody>
            <RoomCardFooter
                text="Limpiar habitación"
                bgColor={"var(--white-transparent)"}
                onSliderTriggered={() => {
                    dispatch(toggleRoomDetailsDrawer(true))
                    dispatch(selectMaintenanceSection("mantenance-staff"))
                }}
            />
        </Wrapper>
    )
}

export default Maintenance
