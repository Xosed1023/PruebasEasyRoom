import React, { useEffect, useState } from "react"
import { addExtraHours } from "src/shared/helpers/addExtraHours"
import { useAddExtraHours } from "src/shared/hooks/useAddExtraHours"
import { useElapsedTimePercentRange } from "src/shared/hooks/useElapsedTimeRangePercent"
import { useTimePulse } from "src/shared/hooks/useTimePulse"
import { useTotalTimeHours } from "src/shared/hooks/useTotalTimeHours"
import Icon from "src/shared/icons"
import "./AvatarProgressCard.css"
import ProgressBarTimerUI from "./UI/ProgressBarTimerUI/ProgressBarTimerUI"
import ProgressBarUI from "./UI/ProgressBarUI/ProgressBarUI"
import AvatarsCollapsable from "../AvatarsCollapsable/AvatarsCollapsable"

const AvatarProgressCard = ({
    timeLimit,
    timeStart,
    extraHours = 0,
    avatarName,
    avatarSrcs,
    daysLabel,
    progressbarDescriprionBottom,
    progressbarDescriprionTop,
    descriptionLink = "camaristas",
    onClickDescriptionLink,
    withPlusOnTimeExceeded = true,
}: {
    timeStart: Date
    timeLimit: Date
    withPlusOnTimeExceeded?: boolean
    extraHours?: number
    avatarSrcs?: string[]
    descriptionLink?: string
    onClickDescriptionLink?: () => void
    avatarName?: string
    daysLabel?: string
    // si este valor existe el contador: se muestra abajo
    // este valor se meustra arriba de la progressbar pero abajo del avatar
    progressbarDescriprionTop?: string
    // si este valor existe el contador: se muestra arriba
    // Este valor se muestra abajo del progressbar
    progressbarDescriprionBottom?: string
}) => {
    const [timeValue] = useTimePulse()
    const [totalTime, setTotalTime] = useState<Date>(addExtraHours(timeLimit, extraHours))

    useEffect(() => {
        setTotalTime(addExtraHours(timeLimit, extraHours))
    }, [timeLimit])

    const timeWithExtraHours = useAddExtraHours(timeLimit, extraHours)
    const totalHoursState = useTotalTimeHours(timeStart, timeWithExtraHours)

    // porcentajes sin '%' y en number
    const [timeValuePercent] = useElapsedTimePercentRange(timeStart, totalTime)
    const [timeLimitPercent] = useElapsedTimePercentRange(timeLimit, totalTime)

    const getStaticTimeLimitPercent = (start: Date, limit: Date, limitWithExtraHours: Date) => {
        const timeStart = start.getTime?.()
        const timeLimit = limit.getTime?.() - timeStart
        const timeLimitWithExtraHours = limitWithExtraHours.getTime?.() - timeStart
        const percent = (timeLimit / timeLimitWithExtraHours) * 100
        return Math.round(percent)
    }

    // Si el tiempo actual ya sobrepaso el limite sin horas extras debe quedarse estático, esto para permitir que avanve la barra de horas extras
    const getTimeValue = (): number => {
        if (timeValue <= timeLimit) {
            return timeValuePercent
        }
        if (extraHours === 0) {
            return timeLimitPercent
        }
        return getStaticTimeLimitPercent(timeStart, timeLimit, totalTime)
    }

    // si el tiempo actual no sobrepasa el limite sin horas extras ocultar la barra de tiempo extra
    const getExtraTimeValue = (): number => {
        if (timeValue <= timeLimit) {
            return 0
        }
        return timeValuePercent
    }

    // porcentajes con '%' y en string
    const [percentValue, setPercentValue] = useState(getTimeValue() + "%")
    const [percentExtraTime, setPercentExtraTime] = useState(getExtraTimeValue() + "%")

    const [now] = useTimePulse()
    useEffect(() => {
        setPercentValue(getTimeValue() + "%")
    }, [now, extraHours, timeLimit])

    useEffect(() => {
        setPercentExtraTime(getExtraTimeValue() + "%")
    }, [extraHours, now, timeLimit])

    return (
        <div
            className="avatar-progress-card"
            style={{
                height: (avatarSrcs?.length || 0) > 1 ? "125px" : "100px",
            }}
        >
            {!avatarSrcs ? (
                <div className="avatar-progress-card__description">
                    <Icon name={"Stopwatch"} color="var(--white)" height={14} width={14} />
                    <span className="avatar-progress-card__description-text">Tiempo restante</span>
                </div>
            ) : (
                <div
                    className="avatar-progress-card__avatar-name"
                    style={{
                        marginTop: (avatarSrcs.length || 0) > 1 ? "" : "10px",
                    }}
                >
                    {avatarSrcs.length > 0 ? (
                        <AvatarsCollapsable imageUrls={avatarSrcs} />
                    ) : (
                        <Icon name={"UserUnfollow"} color="var(--white)" height={28} width={28} />
                    )}
                    <div className="avatar-progress-card__description-text__container">
                        <span className="avatar-progress-card__description-text">{avatarName}</span>
                        {(avatarSrcs?.length || 0) > 1 && (
                            <span
                                className="avatar-progress-card__description-text"
                                onClick={() => onClickDescriptionLink?.()}
                            >
                                +{" "}
                                <span className="avatar-progress-card__description-text__link">
                                    {avatarSrcs.length - 1} {descriptionLink}
                                </span>
                            </span>
                        )}
                    </div>
                </div>
            )}
            <ProgressBarTimerUI
                timeLimit={totalTime}
                progress={timeValue <= timeLimit ? percentValue : percentExtraTime}
                timeValue={timeValue}
                timeStart={timeStart}
                daysLabel={daysLabel}
                progressbarDescriprionTop={progressbarDescriprionTop}
                avatarSrcs={avatarSrcs}
                withPlusOnTimeExceeded={withPlusOnTimeExceeded}
            >
                <ProgressBarUI
                    percentExtraTime={extraHours > 0 ? percentExtraTime : "0%"}
                    percentValue={percentValue}
                    totalHours={totalHoursState}
                />
            </ProgressBarTimerUI>
            {/* si no hay avatar este texto se muestra */}
            {progressbarDescriprionBottom && (
                <span className="avatar-progress-card__entry-time">{progressbarDescriprionBottom}</span>
            )}
        </div>
    )
}

export default AvatarProgressCard
