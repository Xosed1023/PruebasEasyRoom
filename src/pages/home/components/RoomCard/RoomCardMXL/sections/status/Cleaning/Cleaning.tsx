import React from "react"
import { RoomStatusProps } from "../../../../interfaces/RoomStatusProps.interface"
import ProgressBar from "../../shared/ProgressBar/ProgressBar"
import RoomCardBody from "../../shared/RoomCardBody/RoomCardBody"
import RoomCardFooter from "../../shared/RoomCardFooter/RoomCardFooter"
import RoomCardHeader from "../../shared/RoomCardHeader/RoomCardHeader"
import Wrapper from "../../shared/Wrapper/Wrapper"

import "./Cleaning.css"
import { useTimePulse } from "src/shared/hooks/useTimePulse"
import { useDate } from "src/shared/hooks/useDate"
import AvatarsCollapsable from "src/shared/components/data-display/AvatarsCollapsable/AvatarsCollapsable"

const Cleaning = ({
    roomNumber,
    hasIncidences,
    roomTypeName,
    cleaningTimeEnd = "",
    cleaningTimeStart = "",
    occupiedExtraHours,
    cleaningColaboradorNames,
    cleaningColaboradorPhotosUrl,
}: Omit<RoomStatusProps, "roomStatus">) => {
    const [now] = useTimePulse()
    const { UTCStringToLocalDate } = useDate()

    return (
        <Wrapper
            bgColor="var(--card-limpieza-2)"
            alertBgColor1={now > UTCStringToLocalDate(cleaningTimeEnd) ? "var(--card-limpieza-bg-1)" : null}
            alertBgColor2={now > UTCStringToLocalDate(cleaningTimeEnd) ? "var(--card-limpieza-2)" : null}
        >
            <RoomCardHeader
                hasIncidences={hasIncidences}
                roomNumber={roomNumber}
                roomTypeName={roomTypeName}
                iconBgColor="var(--card-limpieza-1)"
                iconName={"broom"}
                cleaningTimeEnd={cleaningTimeEnd}
            />
            <RoomCardBody verticalAlign="center">
                <AvatarsCollapsable
                    imageUrls={
                        (cleaningColaboradorPhotosUrl?.length || 1) > 1 ? cleaningColaboradorPhotosUrl || [""] : [""]
                    }
                    imageSize={24}
                />
                <span className="room-card--mxl-cleaning__name">
                    {(cleaningColaboradorNames?.length || 1) === 1
                        ? `${cleaningColaboradorNames?.[0].nombre} ${cleaningColaboradorNames?.[0].apellido_paterno} ${cleaningColaboradorNames?.[0].apellido_materno}`
                        : `${cleaningColaboradorNames?.[0].nombre?.split(" ")?.[0]} ${
                            cleaningColaboradorNames?.[0].apellido_paterno[0]
                        }.`}
                </span>
                {(cleaningColaboradorNames?.length || 0) > 1 && (
                    <span className="room-card--mxl-cleaning__number">
                        {`+${(cleaningColaboradorNames?.length || 1) - 1 || 0} camarista${
                            (cleaningColaboradorNames?.length || 1) > 2 ? "s" : ""
                        }`}
                    </span>
                )}
                <div style={{ textAlign: now < UTCStringToLocalDate(cleaningTimeEnd) ? "left" : "right" }}>
                    <ProgressBar
                        timeValue={now}
                        timeStart={UTCStringToLocalDate(cleaningTimeStart)}
                        timeLimit={UTCStringToLocalDate(cleaningTimeEnd)}
                        alertTimerBgColor1={"var(--card-limpieza-3)"}
                        alertTimerBgColor2={"var(--card-limpieza-1)"}
                        alertTimerTextColor1={"var(--card-limpieza-1)"}
                        alertTimerTextColor2={"var(--white)"}
                        valueBarBgColor={"var(--card-limpieza-1)"}
                        totalTimeBarBgColor={"var(--gray-background)"}
                    />
                </div>
            </RoomCardBody>
            <RoomCardFooter
                text="Finalizar limpieza"
                bgColor={
                    now > UTCStringToLocalDate(cleaningTimeEnd) ? "var(--white-transparent)" : "var(--gray-background)"
                }
            />
        </Wrapper>
    )
}

export default Cleaning
