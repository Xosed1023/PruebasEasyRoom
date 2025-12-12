import React from "react"
import Icon from "../../icons"
import "./EstatusDeHabitaciones.css"
import { useSelector } from "react-redux"
import { RootState } from "src/store/store"
import { RoomStatus } from "src/pages/home/components/RoomCard/enums/RoomStatus.enum"

const EstatusDeHabitaciones = () => {
    const { rooms } = useSelector((state: RootState) => state.rooms)
    const statusCount: Record<RoomStatus, number> = {} as Record<RoomStatus, number>
    rooms?.forEach((room) => {
        const status = room.estado
        if (statusCount[status]) {
            statusCount[status]++
        } else {
            statusCount[status] = 1
        }
    })
    return (
        <div className="widStatusRoom">
            <div className="widStatusRoom__title">Estatus de habitaciones</div>
            <div className="widStatusRoom__list">
                <div className="widStatusRoom__item">
                    <div className="widStatusRoom__list__text">
                        <div className="widStatusRoom__list__icon" style={{ background: "#408232" }}>
                            <Icon color="#fff" name="check" />
                        </div>
                        Preparada
                    </div>
                    <div className="widStatusRoom__widStatusRoom__list__number">{statusCount.preparada || 0}</div>
                </div>
                <div className="widStatusRoom__item">
                    <div className="widStatusRoom__list__text">
                        <div className="widStatusRoom__list__icon" style={{ background: "#408232" }}>
                            <Icon color="#fff" name="moneyDollarCircleLine" />
                        </div>
                        A la venta
                    </div>
                    <div className="widStatusRoom__widStatusRoom__list__number">{statusCount.a_la_venta || 0}</div>
                </div>
                <div className="widStatusRoom__item">
                    <div className="widStatusRoom__list__text">
                        <div className="widStatusRoom__list__icon" style={{ background: "#EB5757" }}>
                            <Icon color="#fff" name="BedFilled" />
                        </div>
                        Ocupadas
                    </div>
                    <div className="widStatusRoom__widStatusRoom__list__number">{statusCount.ocupada || 0}</div>
                </div>
                <div className="widStatusRoom__item">
                    <div className="widStatusRoom__list__text">
                        <div className="widStatusRoom__list__icon" style={{ background: "#FFC907" }}>
                            <Icon color="#fff" name="trashFilled" />
                        </div>
                        Sucia
                    </div>
                    <div className="widStatusRoom__widStatusRoom__list__number">{statusCount.sucia || 0}</div>
                </div>
                <div className="widStatusRoom__item">
                    <div className="widStatusRoom__list__text">
                        <div className="widStatusRoom__list__icon" style={{ background: "#5374AE" }}>
                            <Icon color="#fff" name="broom" />
                        </div>
                        Limpieza
                    </div>
                    <div className="widStatusRoom__widStatusRoom__list__number">{statusCount.limpieza || 0}</div>
                </div>
                <div className="widStatusRoom__item">
                    <div className="widStatusRoom__list__text">
                        <div className="widStatusRoom__list__icon" style={{ background: "#7a82a0" }}>
                            <Icon color="#fff" name="tools" />
                        </div>
                        Mantenimiento
                    </div>
                    <div className="widStatusRoom__widStatusRoom__list__number">{statusCount.mantenimiento || 0}</div>
                </div>
                <div className="widStatusRoom__item">
                    <div className="widStatusRoom__list__text">
                        <div className="widStatusRoom__list__icon" style={{ background: "#6941C6" }}>
                            <Icon color="#fff" name="calendarEvent" />
                        </div>
                        Reservada
                    </div>
                    <div className="widStatusRoom__widStatusRoom__list__number">{statusCount.reservada || 0}</div>
                </div>
                <div className="widStatusRoom__item">
                    <div className="widStatusRoom__list__text">
                        <div className="widStatusRoom__list__icon" style={{ background: "#333" }}>
                            <Icon color="#fff" name="lock" />
                        </div>
                        Bloqueada
                    </div>
                    <div className="widStatusRoom__widStatusRoom__list__number">{statusCount.bloqueada || 0}</div>
                </div>
                <div className="widStatusRoom__item">
                    <div className="widStatusRoom__list__text">
                        <div className="widStatusRoom__list__icon" style={{ background: "#518CB7" }}>
                            <Icon color="#fff" name="SearchWatch" secondarycolor="#518CB7" />
                        </div>
                        Pte. de supervisión
                    </div>
                    <div className="widStatusRoom__widStatusRoom__list__number">{statusCount.supervision_pendiente || 0}</div>
                </div>
            </div>
            <div className="widStatusRoom__btn" onClick={() => window.open("/fullscreen/disponibilidad", "_blank")}>
                <Icon color={"var(--white)"} height={16} width={16} name={"computerFill"} />
                <span>{"Proyectar  disponibilidad"}</span>
            </div>
        </div>
    )
}

export default EstatusDeHabitaciones
