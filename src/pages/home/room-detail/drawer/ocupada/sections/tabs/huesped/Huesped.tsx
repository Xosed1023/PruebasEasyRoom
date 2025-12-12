import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useRoom } from "src/pages/home/room-detail/hooks"
import { PrimaryButton, SecondaryButton } from "src/pages/home/room-detail/sections/elements/Elements"
import DescriptionDetail from "src/shared/components/data-display/description-detail/DescriptionDetail"

import "./Huesped.css"
import PersonasExtra from "src/pages/home/room-detail/Modals/PersonasExtra/PersonasExtra"
import TiempoExtra from "src/pages/home/room-detail/Modals/TiempoExtra/TiempoExtra"
import useMiniSnackbar from "src/shared/hooks/useMiniSnackbar"
import { Estados_Habitaciones, TiposAlojamientos, useActualizar_Colaboradores_TareasMutation } from "src/gql/schema"
import { useProfile } from "src/shared/hooks/useProfile"
import { useDispatch } from "react-redux"
import { toggleRoomDetailsDrawer } from "src/store/navigation/navigationSlice"
import { useCleaningTypes } from "src/pages/home/room-detail/hooks/limpieza"
import { add, times } from "src/shared/helpers/calculator"
import { client } from "src/graphql"
import { useRoomDarwer } from "src/pages/home/room-detail/hooks/darwer"
import { GET_ROOM } from "src/pages/home/graphql/queries/rooms.query"
import { ModalConfirm } from "src/shared/components/layout"
import IconBorder from "src/shared/components/data-display/IconBorder/IconBorder"
import Icon from "src/shared/icons"
import { formatCurrency } from "src/shared/hooks/formatCurrency"
import IncidenciasItem from "src/pages/home/room-detail/sections/items/Incidencias"
import BoldedText from "src/shared/components/data-display/bolded-text/BoldedText"
import { ItemMultiplePayment } from "src/pages/home/room-detail/sections/items/Items"
import EditVehicleModal from "./Components/EditVehiclePlateModal/EditVehicleModal"
import useIsColaboradorActive from "src/shared/hooks/useIsColaboradorActive"
import { RoleNames } from "src/shared/hooks/useAuth"
import { useFormatDate } from "src/shared/hooks/useFormatDate"

const Huesped = ({
    onClean,
    onSwapColaborador,
    onSwapTipoLimpieza,
}: {
    onClean: () => void
    onSwapColaborador: () => void
    onSwapTipoLimpieza: () => void
}) => {
    const room = useRoom()
    const navigate = useNavigate()
    const { showMiniSnackbar } = useMiniSnackbar()
    const cleanTypes = useCleaningTypes()
    const { visible } = useRoomDarwer()
    const { InactiveModal, validateIsColabActive } = useIsColaboradorActive()

    const getCleanType = () => {
        const tipoLimpieza = room?.colaborador_tareas_sin_finalizar?.[0].tipo_limpieza
        return cleanTypes.find(({ value }) => value === tipoLimpieza)
    }

    const [finalizarTarea] = useActualizar_Colaboradores_TareasMutation()
    const { usuario_id, rolName, hotel_id } = useProfile()
    const isMantenimiento = rolName === RoleNames.mantenimiento
    const dispatch = useDispatch()

    const [showModalPersonasExtra, setShowModalPersonasExtra] = useState<boolean>(false)
    const [showModalTiempoExtra, setShowModalTiempoExtra] = useState<boolean>(false)
    const [pagosPendientes, setPagosPendientes] = useState<number>(0)
    const [isModalPagosPendientesOpen, setIsModalPagosPendientesOpen] = useState<boolean>(false)
    const [lovePointsId, setLovePointsId] = useState<string>("")
    const [showModalEditarMatricula, setShowModalEditarMatricula] = useState<boolean>(false)
    const [matricula, setMatricula] = useState<string>(room?.ultima_renta?.vehiculo?.matricula || "")
    const [marca, setMarca] = useState<string>(room?.ultima_renta?.vehiculo?.marca || "")
    const [modelo, setModelo] = useState<string>(room?.ultima_renta?.vehiculo?.modelo || "")
    const [color, setColor] = useState<string>(room?.ultima_renta?.vehiculo?.color || "")
    const { formatCustomDate } = useFormatDate()
    const getRoom = async () => {
        const { data } = await client.query({
            query: GET_ROOM,
            variables: {
                habitacion_id: room?.habitacion_id,
                usuario_id: usuario_id,
                hotel_id,
            },
            fetchPolicy: "no-cache",
        })
        checkPaymentMethod(data)

        if (data.habitacion) {
            const totalOrdenPendiente =
                data.habitacion?.ultima_renta?.saldo_pendiente_ordenes &&
                data.habitacion?.ultima_renta.saldo_pendiente_ordenes > 0
                    ? data.habitacion?.ultima_renta.saldo_pendiente_ordenes
                    : 0

            const totalEstanciaPendiente =
                data.habitacion?.ultima_renta?.saldo_pendiente_estancia &&
                data.habitacion?.ultima_renta.saldo_pendiente_estancia > 0
                    ? data.habitacion?.ultima_renta.saldo_pendiente_estancia
                    : 0

            const totalPagosPendientes = totalEstanciaPendiente + totalOrdenPendiente
            setPagosPendientes(totalPagosPendientes)
        }
    }
    useEffect(() => {
        getRoom()
    }, [visible])

    const checkPaymentMethod = (data) => {
        const paymentDetails = data?.habitacion?.ultima_renta?.pagos?.flatMap((pago) => pago.detalles_pago)

        const lovePointsPayment =
            paymentDetails &&
            paymentDetails.find((detalle) => detalle.tipo_pago === "love_points" || detalle.easyrewards_id)
        if (lovePointsPayment) {
            setLovePointsId(lovePointsPayment.easyrewards_id || "")
        } else {
            setLovePointsId(data?.habitacion?.ultima_renta?.easyrewards_id || "")
        }
    }

    return (
        <div className="animante__opacity-transform__ease room-detail--occupied__tab--huesped--cleaning">
            <div
                style={{
                    height: !room?.colaborador_tareas_sin_finalizar?.length
                        ? "calc(100dvh - 430px)"
                        : "calc(100dvh - 470px)",
                    overflow: "hidden auto",
                    margin: "20px 0",
                    marginBottom: !room?.colaborador_tareas_sin_finalizar?.length ? "" : "20px",
                    width: "100%",
                }}
            >
                {!!room?.colaborador_tareas_sin_finalizar?.length && (
                    <DescriptionDetail
                        icon="businessStar"
                        label="Tipo de limpieza"
                        style={{
                            width: "100%",
                            padding: "12px",
                        }}
                        onLink={!isMantenimiento ? validateIsColabActive(() => onSwapTipoLimpieza()) : undefined}
                        link={rolName !== RoleNames.valet && rolName !== RoleNames.mantenimiento ? "Cambiar" : ""}
                        value={getCleanType()?.label || "-"}
                    />
                )}

                {room?.ultima_renta?.reserva?.correo_huesped && (
                    <DescriptionDetail
                        icon="mailOpenFill"
                        label="Correo"
                        style={{
                            width: "100%",
                            padding: "12px",
                        }}
                        value={room?.ultima_renta?.reserva?.correo_huesped || "-"}
                    />
                )}
                {(room?.ultima_renta?.nombre_huesped || room?.ultima_renta?.reserva?.nombre_huesped) && (
                    <DescriptionDetail
                        icon="userFilled"
                        label="Nombre completo del huésped"
                        style={{
                            width: "100%",
                            padding: "12px",
                        }}
                        value={room?.ultima_renta?.nombre_huesped || room?.ultima_renta?.reserva?.nombre_huesped || "-"}
                    />
                )}
                {room?.ultima_renta?.reserva && (
                    <DescriptionDetail
                        icon="BusinessGlobalFill"
                        label="Origen de la reserva"
                        style={{
                            width: "100%",
                            padding: "12px",
                        }}
                        value={room?.ultima_renta?.reserva?.origen || "-"}
                    />
                )}
                {!!lovePointsId && (
                    <DescriptionDetail
                        icon="giftFill"
                        label="Easyrewards"
                        style={{
                            width: "100%",
                            padding: "12px",
                        }}
                        value={lovePointsId}
                    />
                )}

                <DescriptionDetail
                    icon="dollarCircle"
                    label="Tarifa"
                    style={{
                        width: "100%",
                        padding: "12px",
                    }}
                    value={room?.ultima_renta?.tarifa?.nombre || "-"}
                />
                <DescriptionDetail
                    icon="UserThinFilled"
                    label="Personas"
                    style={{
                        width: "100%",
                        padding: "12px",
                    }}
                    value={room?.ultima_renta?.numero_personas}
                />
                {!!room?.ultima_reserva?.reserva?.experiencias_reserva?.length && room?.ultima_renta?.reserva_id && (
                    <ItemMultiplePayment
                        showAmounts={false}
                        icon={"star"}
                        label={"Experiencias"}
                        style={{
                            width: "100%",
                            padding: "12px",
                        }}
                        className="detalle-h-items__multiple--experience"
                        labelClass="detalle-h-items__multiple__text--experience"
                        payments={
                            room?.ultima_reserva?.reserva?.experiencias_reserva?.map((s) => ({
                                label: s.experiencia?.nombre || "",
                                amount: s.total ?? 0,
                            })) || []
                        }
                    />
                )}
                <DescriptionDetail
                    icon="UserParentFill"
                    label="Personas extras"
                    style={{
                        width: "100%",
                        padding: "12px",
                    }}
                    link={
                        !isMantenimiento && rolName !== RoleNames.monitoreo ? "Agregar" : ""
                        /*room?.ultima_renta?.tarifa?.personas_extra_max - room?.ultima_renta?.personas_extra > 0
                          ? "Agregar"
                          : undefined*/
                    }
                    onLink={validateIsColabActive(() => setShowModalPersonasExtra(true))}
                    value={room?.ultima_renta?.personas_extra}
                />
                <DescriptionDetail
                    icon="calendarFill"
                    label="Fecha de estancia"
                    style={{
                        width: "100%",
                        padding: "12px",
                    }}
                    link={!isMantenimiento && rolName !== RoleNames.monitoreo ? "Agregar" : ""}
                    onLink={
                        !isMantenimiento && rolName !== RoleNames.monitoreo
                            ? validateIsColabActive(() => setShowModalTiempoExtra(true))
                            : undefined
                    }
                    value={`${formatCustomDate(
                        room?.ultima_renta?.fecha_registro,
                        "MMM, DD YYYY"
                    )} - ${formatCustomDate(room?.ultima_renta?.fecha_condensada, "MMM, DD YYYY")}`}
                />
                {((room?.ultima_renta?.horas_extra || 0) > 0 || (room?.ultima_renta?.hospedajes_extra || 0) > 0) && (
                    <DescriptionDetail
                        icon="MoonFill"
                        label="Tiempo extra"
                        style={{
                            width: "100%",
                            padding: "12px",
                        }}
                        value={(() => {
                            if (room.ultima_renta?.tarifa?.tipo_alojamiento === TiposAlojamientos.Hotel) {
                                const stringNoches =
                                    room?.ultima_renta.hospedajes_extra > 0
                                        ? `${room?.ultima_renta.hospedajes_extra} noche${
                                              room?.ultima_renta.hospedajes_extra > 1 ? "s" : ""
                                        }`
                                        : ""

                                const stringHoras =
                                    room?.ultima_renta.horas_extra > 0
                                        ? `${room?.ultima_renta.horas_extra} hora${
                                              room?.ultima_renta.horas_extra > 1 ? "s" : ""
                                        }`
                                        : ""
                                return `${stringNoches}${stringNoches ? " " : ""}${stringHoras}`
                            }
                            return `Estancia ${add(
                                times(room?.ultima_renta?.tarifa?.duracion_renta, room?.ultima_renta?.hospedajes_extra),
                                room?.ultima_renta.horas_extra
                            )} hora${room?.ultima_renta.horas_extra > 1 ? "s" : ""}`
                        })()}
                    />
                )}
                {/* {diffDays(
                    UTCStringToLocalDate(room?.ultima_renta?.fecha_registro),
                    UTCStringToLocalDate(room?.ultima_renta?.fecha_fin)
                ) >= 1 && (
                    <DescriptionDetail
                        icon="MoonFill"
                        label="Noches"
                        style={{
                            width: "100%",
                            padding: "12px",
                        }}
                        value={
                            diffDays(
                                UTCStringToLocalDate(room?.ultima_renta?.fecha_registro),
                                UTCStringToLocalDate(room?.ultima_renta?.fecha_fin)
                            ) + ""
                        }
                    />
                )} */}
                <DescriptionDetail
                    icon={room?.ultima_renta?.tipo_entrada === "A_Pie" ? "walking" : "car"}
                    label="Tipo de entrada"
                    style={{
                        width: "100%",
                        padding: "12px",
                    }}
                    link={!isMantenimiento && rolName !== RoleNames.monitoreo ? "Editar" : ""}
                    onLink={
                        !isMantenimiento && rolName !== RoleNames.monitoreo
                            ? validateIsColabActive(() => setShowModalEditarMatricula(true))
                            : undefined
                    }
                    value={
                        room?.ultima_renta?.tipo_entrada === "A_Pie"
                            ? "A pie"
                            : [matricula, marca, color, modelo].filter(Boolean).join(" / ")
                    }
                />
                <DescriptionDetail
                    icon="CheckBoxMultipleFill"
                    label="Último responsable de liberación"
                    style={{
                        width: "100%",
                        padding: "12px",
                        marginBottom: 30,
                    }}
                    value={
                        room?.ultimos_datos?.ultima_supervision?.colaborador
                            ? `${room.ultimos_datos.ultima_supervision.colaborador.nombre} ${room.ultimos_datos.ultima_supervision.colaborador.apellido_paterno} ${room.ultimos_datos.ultima_supervision.colaborador.apellido_materno}`
                            : "-"
                    }
                />
                <IncidenciasItem />
            </div>
            {showModalPersonasExtra && <PersonasExtra onClose={() => setShowModalPersonasExtra(false)} />}
            {showModalTiempoExtra && <TiempoExtra onClose={() => setShowModalTiempoExtra(false)} />}
            {!isMantenimiento &&
                rolName !== RoleNames.valet &&
                rolName !== RoleNames.roomService &&
                rolName !== RoleNames.monitoreo &&
                (!room?.colaborador_tareas_sin_finalizar?.length ? (
                    <>
                        <PrimaryButton
                            text={"Check out"}
                            onClick={validateIsColabActive(() =>
                                pagosPendientes > 0
                                    ? setIsModalPagosPendientesOpen(true)
                                    : navigate(`/u/detalle-habitacion/checkout/${room.habitacion_id}`)
                            )}
                            style={{ marginBottom: "12px" }}
                        />
                        <SecondaryButton text={"Limpiar habitación"} onClick={validateIsColabActive(() => onClean())} />
                    </>
                ) : (
                    <>
                        <PrimaryButton
                            text={"Finalizar limpieza"}
                            onClick={validateIsColabActive(() => {
                                finalizarTarea({
                                    variables: {
                                        datos_tarea: {
                                            colaboradores_tareas_ids: room?.colaborador_tareas_sin_finalizar?.map(
                                                (c) => c?.colaborador_tarea_id
                                            ),
                                            usuario_id,
                                            hotel_id,
                                            estado: Estados_Habitaciones.Ocupada,
                                        },
                                    },
                                })
                                    .then(() => {
                                        showMiniSnackbar({
                                            title: "Limpieza finalizada",
                                            status: "success",
                                            text: `La limpieza ha finalizado con éxito en la habitación **${room?.tipo_habitacion?.nombre} ${room?.numero_habitacion}**`,
                                        })
                                        dispatch(toggleRoomDetailsDrawer(false))
                                    })
                                    .catch(() => {
                                        showMiniSnackbar({
                                            title: "Error al finalizar limpieza",
                                            status: "error",
                                            text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente",
                                        })
                                    })
                            })}
                            style={{ marginBottom: "12px" }}
                        />
                        <SecondaryButton
                            text={"Cambiar o agregar camarista"}
                            onClick={validateIsColabActive(() => onSwapColaborador())}
                        />
                    </>
                ))}

            <ModalConfirm
                icon={
                    <IconBorder primaryBgDiameter={24} primaryBgColor="var(--green-available)">
                        <Icon name="building4Fill" color="var(--white)" height={14} width={14} />
                    </IconBorder>
                }
                iconTheme="success"
                title="Pagos pendientes"
                confirmLabel="Ver pendientes"
                isOpen={isModalPagosPendientesOpen}
                description={
                    <BoldedText
                        className="room-detail--occupied__container__cancel__description"
                        boldClassName="room-detail--occupied__container__cancel__description"
                    >
                        {`La habitación **${room.nombre}** tiene pagos pendientes por un total **${formatCurrency(
                            pagosPendientes || 0
                        )}**`}
                    </BoldedText>
                }
                onCloseDialog={({ confirmed }) => {
                    setIsModalPagosPendientesOpen(false)
                    if (!confirmed) {
                        return
                    }
                    navigate(`/u/room-service/pago/${room.ultima_renta.renta_id}`, {
                        state: { origen: "ModalPendiente", habitacionId: room.habitacion_id },
                    })
                }}
            />
            {showModalEditarMatricula && (
                <EditVehicleModal
                    isOpen={showModalEditarMatricula}
                    onClose={() => setShowModalEditarMatricula(false)}
                    renta_id={room?.ultima_renta?.renta_id}
                    currentMatricula={matricula}
                    currentColor={color}
                    currentModelo={modelo}
                    currentMarca={marca}
                    onSave={({ matricula, color, modelo, marca }) => {
                        setMatricula(matricula)
                        setColor(color)
                        setModelo(modelo)
                        setMarca(marca)
                        getRoom()
                    }}
                />
            )}
            {InactiveModal}
        </div>
    )
}

export default Huesped
