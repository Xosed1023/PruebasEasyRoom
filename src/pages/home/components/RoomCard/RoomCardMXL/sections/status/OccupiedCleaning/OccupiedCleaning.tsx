import React from "react"
import { RoomStatusProps } from "../../../../interfaces/RoomStatusProps.interface"
import ProgressBar from "../../shared/ProgressBar/ProgressBar"
import RoomCardBody from "../../shared/RoomCardBody/RoomCardBody"
import RoomCardFooter from "../../shared/RoomCardFooter/RoomCardFooter"
import RoomCardHeader from "../../shared/RoomCardHeader/RoomCardHeader"
import Wrapper from "../../shared/Wrapper/Wrapper"

import "./OccupiedCleaning.css"
import { useTimePulse } from "src/shared/hooks/useTimePulse"
import { useDate } from "src/shared/hooks/useDate"
import AvatarsCollapsable from "src/shared/components/data-display/AvatarsCollapsable/AvatarsCollapsable"

const OccupiedCleaning = ({
    roomNumber,
    roomTypeName,
    cleaningTimeEnd = "",
    cleaningTimeStart,
    hasIncidences,
    occupiedTimeEnd = "",
    occupiedTimeEndCondensada,
    cleaningColaboradorNames,
    cleaningColaboradorPhotosUrl,
    occupiedExtraHours,
    easyrewards,
}: Omit<RoomStatusProps, "roomStatus">) => {
    const [now] = useTimePulse()
    const { UTCStringToLocalDate } = useDate()

    return (
        <Wrapper
            bgColor="var(--pink-ocupado-light)"
            alertBgColor1={now > UTCStringToLocalDate(cleaningTimeEnd) ? "var(--ocupada-card-1)" : null}
            alertBgColor2={now > UTCStringToLocalDate(cleaningTimeEnd) ? "var(--pink-ocupado-light)" : null}
        >
            <RoomCardHeader
                hasIncidences={hasIncidences}
                roomNumber={roomNumber}
                roomTypeName={roomTypeName}
                iconBgColor="var(--pink-ocupado)"
                iconName={"broom"}
                cleaningTimeEnd={cleaningTimeEnd}
                easyrewards={easyrewards}
            />
            <RoomCardBody verticalAlign="center" style={{ marginTop: "-10px" }}>
                <AvatarsCollapsable
                    imageUrls={
                        (cleaningColaboradorPhotosUrl?.length || 1) > 1 ? cleaningColaboradorPhotosUrl || [""] : [""]
                    }
                    imageSize={24}
                />
                <span className="room-card--mxl-occupied-cleaning__name">
                    {(cleaningColaboradorNames?.length || 1) === 1
                        ? `${cleaningColaboradorNames?.[0].nombre} ${cleaningColaboradorNames?.[0].apellido_paterno} ${cleaningColaboradorNames?.[0].apellido_materno}`
                        : `${cleaningColaboradorNames?.[0].nombre?.split(" ")?.[0]} ${
                            cleaningColaboradorNames?.[0].apellido_paterno[0]
                        }.`}
                </span>
                {(cleaningColaboradorNames?.length || 0) > 1 && (
                    <span className="room-card--mxl-occupied-cleaning__number">
                        {`+${(cleaningColaboradorNames?.length || 1) - 1 || 0} camarista${
                            (cleaningColaboradorNames?.length || 1) > 2 ? "s" : ""
                        }`}
                    </span>
                )}
                <div style={{ textAlign: now < UTCStringToLocalDate(occupiedTimeEnd) ? "left" : "right" }}>
                    <ProgressBar
                        timeValue={now}
                        timeStart={UTCStringToLocalDate(cleaningTimeStart)}
                        timeLimit={UTCStringToLocalDate(cleaningTimeEnd)}
                        extraHours={0}
                        alertTimerBgColor1={"var(--pink-ocupado-light)"}
                        alertTimerBgColor2={"var(--pink-ocupado)"}
                        alertTimerTextColor1={"var(--pink-ocupado)"}
                        alertTimerTextColor2={"var(--white)"}
                    />
                </div>
            </RoomCardBody>
            <RoomCardFooter
                text="Finalizar limpieza"
                bgColor={
                    now > UTCStringToLocalDate(occupiedTimeEndCondensada)
                        ? "var(--white-transparent)"
                        : "var(--gray-background)"
                }
            />
        </Wrapper>
    )
}

export default OccupiedCleaning
