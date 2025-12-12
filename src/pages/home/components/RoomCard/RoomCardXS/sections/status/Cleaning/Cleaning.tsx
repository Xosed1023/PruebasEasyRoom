import { RoomStatusProps } from "../../../../interfaces/RoomStatusProps.interface"
import RoomCardBody from "../../shared/RoomCardBody/RoomCardBody"
import RoomCardHeader from "../../shared/RoomCardHeader/RoomCardHeader"
import Wrapper from "../../shared/Wrapper/Wrapper"

import "./Cleaning.css"
import { useDate } from "src/shared/hooks/useDate"
import { useTimePulse } from "src/shared/hooks/useTimePulse"
import { useElapsedTime } from "src/shared/hooks/useElapsedTime"
import { useMaxWidthContext } from "../../../hooks/useMaxWidth"
import { useSelector } from "react-redux"
import { RootState } from "src/store/store"

const Cleaning = ({
    roomNumber,
    roomTypeName,
    occupiedExtraHours = 0,
    cleaningTimeEnd,
    cleaningColaboradorNames,
    hasIncidences,
}: RoomStatusProps) => {
    const { UTCStringToLocalDate } = useDate()
    const { maxWidth } = useMaxWidthContext()
    const [now] = useTimePulse()
    const [elapedTime] = useElapsedTime(UTCStringToLocalDate(cleaningTimeEnd))

    const { roomsDimensions } = useSelector((state: RootState) => state.rooms)

    const itemHeight = `calc(calc(80dvh - 240px) / ${(roomsDimensions?.x || 1) * 4})`;

    return (
        <Wrapper
            bgColor="var(--card-limpieza-2)"
            alertBgColor1={now > UTCStringToLocalDate(cleaningTimeEnd) ? "var(--card-limpieza-bg-1)" : null}
            alertBgColor2={now > UTCStringToLocalDate(cleaningTimeEnd) ? "var(--card-limpieza-2)" : null}
        >
            <RoomCardHeader
                hasIncidences={hasIncidences}
                iconName={"broom"}
                roomTypeAbbreviation={roomTypeName?.[0]}
                roomNumber={roomNumber}
                iconBgColor="var(--card-limpieza-1)"
            />
            <RoomCardBody>
                <div style={{ maxWidth }} className="room-card--xs--cleaning__description__wrapper">
                    {now > UTCStringToLocalDate(cleaningTimeEnd) ? (
                        <span className="room-card--xs--cleaning__timer--timeout" style={{fontSize: itemHeight}}>+{elapedTime}</span>
                    ) : (
                        <span className="room-card--xs--cleaning__timer" style={{fontSize: itemHeight}}>{elapedTime}</span>
                    )}
                    <div className="room-card--xs--cleaning__description__sucontainer">
                        <span className="room-card--xs--cleaning__description room-card--xs--cleaning__description__subtext" style={{fontSize: itemHeight}}>
                            {(cleaningColaboradorNames?.length || 1) === 1
                                ? `${cleaningColaboradorNames?.[0].nombre} ${cleaningColaboradorNames?.[0].apellido_paterno} ${cleaningColaboradorNames?.[0].apellido_materno}`
                                : `${cleaningColaboradorNames?.[0].nombre?.split(" ")?.[0]}
                        `}
                            &nbsp;
                        </span>
                        <span className="room-card--xs--cleaning__description" style={{fontSize: itemHeight}}>
                            {(cleaningColaboradorNames?.length || 1) > 1
                                ? "C. (+" + ((cleaningColaboradorNames?.length || 1) - 1) + ")"
                                : ""}
                        </span>
                    </div>
                </div>
            </RoomCardBody>
        </Wrapper>
    )
}

export default Cleaning
