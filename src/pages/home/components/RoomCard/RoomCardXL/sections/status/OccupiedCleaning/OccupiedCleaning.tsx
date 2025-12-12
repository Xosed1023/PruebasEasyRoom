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
import useSnackbar from "src/shared/hooks/useSnackbar"
import { useProfile } from "src/shared/hooks/useProfile"
import { useActualizar_Colaboradores_TareasMutation } from "src/gql/schema"
import AvatarsCollapsable from "src/shared/components/data-display/AvatarsCollapsable/AvatarsCollapsable"

const OccupiedCleaning = ({
    roomNumber,
    roomTypeName,
    cleaningTimeEnd = "",
    cleaningTimeStart,
    occupiedTimeEnd = "",
    occupiedTimeEndCondensada,
    cleaningColaboradorNames,
    cleaningColaboradorPhotosUrl,
    hasIncidences,
    occupiedExtraHours,
    room,
    easyrewards,
}: Omit<RoomStatusProps, "roomStatus">) => {
    const [now] = useTimePulse()
    const { UTCStringToLocalDate } = useDate()
    const [finalizarTarea] = useActualizar_Colaboradores_TareasMutation()

    const { showSnackbar } = useSnackbar()

    const { usuario_id, hotel_id } = useProfile()

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
                iconName="broom"
                cleaningTimeEnd={UTCStringToLocalDate(cleaningTimeEnd)}
                cleaningTimeValue={now}
                easyrewards={easyrewards}
            />
            <RoomCardBody verticalAlign="center">
                <AvatarsCollapsable
                    imageUrls={
                        (cleaningColaboradorPhotosUrl?.length || 1) > 1 ? cleaningColaboradorPhotosUrl || [""] : [""]
                    }
                    imageSize={40}
                />
                <span className="room-card--xl-occupied-cleaning__name">
                    {(cleaningColaboradorNames?.length || 1) === 1
                        ? `${cleaningColaboradorNames?.[0].nombre} ${cleaningColaboradorNames?.[0].apellido_paterno} ${cleaningColaboradorNames?.[0].apellido_materno}`
                        : `${cleaningColaboradorNames?.[0].nombre?.split(" ")?.[0]} ${
                            cleaningColaboradorNames?.[0].apellido_paterno[0]
                        }.`}
                </span>
                {(cleaningColaboradorNames?.length || 0) > 1 && (
                    <span className="room-card--xl-occupied-cleaning__number">
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
                onSliderTriggered={() => {
                    finalizarTarea({
                        variables: {
                            datos_tarea: {
                                usuario_id,
                                hotel_id,
                                colaboradores_tareas_ids: room?.colaborador_tareas_sin_finalizar?.map(
                                    (c) => c?.colaborador_tarea_id
                                ),
                            },
                        },
                    })
                        .then(() => {
                            showSnackbar({
                                title: "Limpieza finalizada",
                                status: "success",
                                text: `La limpieza ha finalizado con éxito en la **${room?.tipo_habitacion?.nombre} ${room?.numero_habitacion}**`,
                            })
                        })
                        .catch(() => {
                            showSnackbar({
                                title: "Error al finalizar limpieza",
                                status: "error",
                                text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente",
                            })
                        })
                }}
            />
        </Wrapper>
    )
}

export default OccupiedCleaning
