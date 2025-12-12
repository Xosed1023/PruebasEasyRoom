import React, { useRef } from "react"
import RoomCard from "../RoomCard/RoomCard"
import "./RoomCards.css"
import { useSetCardSize } from "./hooks/useSetCardSize"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "src/store/store"
import { addTimeByCleaningType } from "src/shared/helpers/addTimeByCleaningType"
import { RoomStatus } from "../RoomCard/enums/RoomStatus.enum"
import { times } from "src/shared/helpers/calculator"
import { startGetLastReservation, startGetSelectedRoom } from "../../store/thunks/rooms.thunk"
import { useDate } from "src/shared/hooks/useDate"
import { useProfile } from "src/shared/hooks/useProfile"
import addMinutes from "src/shared/helpers/addMinutes"
import { getEasyRewardsId } from "./helpers/getEasyRewardsId"
import { MaxWidthProvider } from "../RoomCard/RoomCardXS/hooks/useMaxWidth"
import { MaxHeightProvider } from "../RoomCard/RoomCardXS/hooks/useMaxHeight"

const RoomCards = () => {
    const { rooms, roomsDimensions, lastSelectedRoom } = useSelector((state: RootState) => state.rooms)
    const dispatch = useDispatch()
    const { setHHMMSS, UTCStringToLocalDate } = useDate()

    const containerRef = useRef<HTMLDivElement>(null)

    const { size } = useSetCardSize(containerRef)

    const { zona_horaria } = useProfile()

    return (
        <MaxWidthProvider>
            <MaxHeightProvider>
                <div className="room-cards__wrapper__wrapper scrollbar__light-fat">
                    <div
                        className="room-cards__wrapper"
                        style={{
                            gridTemplate: `repeat(${roomsDimensions?.x}, 1fr) / repeat(${roomsDimensions?.y}, 1fr)`,
                        }}
                    >
                        {rooms?.map((room) => (
                            <RoomCard
                                style={{
                                    gridArea: `${room.posicion.y}/ ${room.posicion.x} / span 1 / span 1`,
                                }}
                                hasIncidences={room?.alerta_incidencia?.incidencia_id}
                                maintenanceDetails={
                                    room?.colaborador_tareas_sin_finalizar?.[0]?.descripcion_tarea || "No comentarios"
                                }
                                ultimaOrden={room?.ultima_renta?.ultima_orden}
                                roomNumber={room.numero_habitacion}
                                roomStatus={room.estado}
                                roomTypeName={room.tipo_habitacion?.nombre}
                                fecha_antigua_por_entregar={room?.ultima_renta?.fecha_antigua_por_entregar}
                                key={room.habitacion_id}
                                details={room.comentario_estado || "No comentarios"}
                                dateStatusChanged={room.fecha_estado}
                                size={size}
                                roomId={room.habitacion_id}
                                roomServiceTimeEnd={
                                    room.estado === RoomStatus.occupied ? new Date().toISOString() : undefined
                                }
                                roomServiceTimeStart={
                                    room.estado === RoomStatus.occupied ? new Date().toISOString() : undefined
                                }
                                // TODO: NO hay fecha fin para tareas de supervision
                                supervisionTimeEnd={room?.colaborador_tareas_sin_finalizar?.[0]?.fecha_inicio}
                                supervisionTimeStart={room?.colaborador_tareas_sin_finalizar?.[0]?.fecha_inicio}
                                lastRentStatus={room?.ultima_renta?.estado}
                                occupiedTimeStart={room.ultima_renta?.fecha_registro}
                                occupiedTimeEnd={room.ultima_renta?.fecha_fin}
                                comentarioUltimoBloqueo={
                                    room?.comentario_estado ||
                                    (RoomStatus.blocked && "Habitación cancelada") ||
                                    "No comentarios"
                                }
                                cleaningTimeEnd={
                                    room?.colaborador_tareas_sin_finalizar?.[0]?.fecha_termino
                                        ? undefined
                                        : addTimeByCleaningType({
                                            date: room.fecha_estado,
                                            cleaningType: room.colaborador_tareas_sin_finalizar?.[0]?.tipo_limpieza,
                                            tiempoLimpiezaDetallada:
                                                room?.tipo_habitacion?.minutos_limpieza_detallada,
                                            tiempoLimpiezaNormal: room?.tipo_habitacion?.minutos_limpieza_normal,
                                            tiempoLimpiezaRetoque: room?.tipo_habitacion?.minutos_limpieza_retoque,
                                        })
                                }
                                cleaningTimeSalida={room?.colaborador_tareas_sin_finalizar?.[0]?.fecha_termino}
                                cleaningTimeStart={room.colaborador_tareas_sin_finalizar?.[0]?.fecha_inicio}
                                cleaningColaboradorPhotosUrl={room?.colaborador_tareas_sin_finalizar?.map(
                                    (t) => t?.colaborador?.foto
                                )}
                                maintenanceColaboradorPhotoUrl={
                                    room?.colaborador_tareas_sin_finalizar?.[0]?.colaborador_id
                                        ? room?.colaborador_tareas_sin_finalizar?.[0]?.colaborador?.foto
                                        : ""
                                }
                                supervisionColaboradorPhotoUrl={
                                    room?.colaborador_tareas_sin_finalizar?.[0]?.colaborador?.foto
                                }
                                cleaningColaboradorNames={room?.colaborador_tareas_sin_finalizar?.map((c) => ({
                                    nombre: c?.colaborador?.nombre,
                                    apellido_paterno: c?.colaborador?.apellido_paterno,
                                    apellido_materno: c?.colaborador?.apellido_materno,
                                }))}
                                maintenanceColaboradorName={
                                    room?.colaborador_tareas_sin_finalizar?.[0]?.colaborador_id
                                        ? `${room?.colaborador_tareas_sin_finalizar?.[0]?.colaborador?.nombre} ${room?.colaborador_tareas_sin_finalizar?.[0]?.colaborador?.apellido_paterno} ${room?.colaborador_tareas_sin_finalizar?.[0]?.colaborador?.apellido_materno}`
                                        : ""
                                }
                                supervisionColaboradorName={`${room?.colaborador_tareas_sin_finalizar?.[0]?.colaborador?.nombre} ${room?.colaborador_tareas_sin_finalizar?.[0]?.colaborador?.apellido_paterno} ${room?.colaborador_tareas_sin_finalizar?.[0]?.colaborador?.apellido_materno}`}
                                occupiedExtraHours={
                                    room.ultima_renta?.horas_extra +
                                    times(
                                        room.ultima_renta?.hospedajes_extra || 0,
                                        room.ultima_renta?.tarifa?.duracion_renta || 0
                                    )
                                }
                                clientName={room.ultima_renta?.nombre_huesped}
                                peopleNum={room.ultima_renta?.numero_personas}
                                placas={room?.ultima_renta?.vehiculo?.matricula}
                                reservedClientName={room.ultima_reserva?.reserva?.nombre_huesped}
                                reservedStartDate={room.ultima_reserva?.reserva?.fecha_entrada || ""}
                                reservedCheckinDate={setHHMMSS({
                                    startDate: UTCStringToLocalDate(room.ultima_reserva?.reserva?.fecha_entrada),
                                    newHour: room.ultima_reserva?.reserva?.tarifa?.hora_checkin || "",
                                })}
                                reservedCheckOutDate={setHHMMSS({
                                    startDate: UTCStringToLocalDate(room.ultima_reserva?.reserva?.fecha_salida),
                                    newHour: room.ultima_reserva?.reserva?.tarifa?.hora_checkout || "",
                                })}
                                reservedEndDate={room.ultima_reserva?.reserva?.fecha_salida || ""}
                                reservedDetails={
                                    room.ultima_reserva?.reserva?.comentarios[
                                        room.ultima_reserva?.reserva?.comentarios?.length - 1
                                    ]?.comentario
                                }
                                reservedPeopleNum={room.ultima_reserva?.reserva?.numero_personas}
                                occupiedTimeEndCondensada={room.ultima_renta?.fecha_condensada}
                                isSelected={room.habitacion_id === lastSelectedRoom?.habitacion_id}
                                onSelect={() => {
                                    dispatch(startGetSelectedRoom(room?.habitacion_id))
                                    dispatch(startGetLastReservation(room?.ultima_reserva?.reserva?.reserva_id))
                                }}
                                uncleanTimeLimit={addMinutes({
                                    utcDate: room.fecha_estado,
                                    minutes: room?.tipo_habitacion?.minutos_sucia,
                                })}
                                supervisionPendingTimeLimit={addMinutes({
                                    utcDate: room.fecha_estado,
                                    minutes: room?.tipo_habitacion?.minutos_pendiente_supervision,
                                })}
                                supervisionTimeLimit={addMinutes({
                                    utcDate: room.fecha_estado,
                                    minutes: room?.tipo_habitacion?.minutos_supervision,
                                })}
                                easyrewards={getEasyRewardsId(room.ultima_renta)}
                                room={room}
                                zonaHoraria={zona_horaria}
                            />
                        ))}
                    </div>
                </div>
            </MaxHeightProvider>
        </MaxWidthProvider>
    )
}

export default RoomCards
