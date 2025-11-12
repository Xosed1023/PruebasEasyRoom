import React from "react"
import { RoomStatusProps } from "../../../../interfaces/RoomStatusProps.interface"
import RoomCardHeader from "../../shared/RoomCardHeader/RoomCardHeader"

import "./Maintenance.css"
import Wrapper from "../../shared/Wrapper/Wrapper"
import { useFilterTipoMantenimiento } from "src/shared/providers/TiposMantenimientoProvider"

const Maintenance = (props: RoomStatusProps) => {
    const { tipoMantenimiento } = useFilterTipoMantenimiento({ size: "xs", name: props.maintenanceDetails || "" })

    return (
        <Wrapper bgColor={"var(--supervision-card)"}>
            <RoomCardHeader
                hasIncidences={props.hasIncidences}
                iconName={"tools"}
                roomNumber={props.roomNumber}
                roomTypeName={props.roomTypeName}
                timeout={props.timeout}
                iconBgColor="var(--mantenimiento)"
            />
            <div className="room-card--lg--maintenance__body">
                <div className="room-card--lg--maintenance__descripcion-wrapper">
                    <div className="room-card--lg--maintenance__descripcion">
                        <span className="room-card--lg--maintenance__descripcion-text">
                            {props.maintenanceColaboradorName}
                        </span>
                    </div>
                </div>
                <div className="room-card--lg--maintenance__descripcion-wrapper">
                    <div className="room-card--lg--maintenance__descripcion">
                        <span className="room-card--lg--maintenance__descripcion-text--bold">
                            {tipoMantenimiento.clave}
                        </span>
                    </div>
                </div>
            </div>
        </Wrapper>
    )
}

export default Maintenance
