import React, { useEffect, useRef, useState } from "react"
import { Controller, useForm } from "react-hook-form"

import "./Details.css"
import DescriptionDetail from "src/shared/components/data-display/description-detail/DescriptionDetail"
import { ItemMultiplePayment } from "src/pages/home/room-detail/sections/items/Items"
import { useRoom } from "src/pages/home/room-detail/hooks"
import { PrimaryButton, SecondaryButton } from "src/pages/home/room-detail/sections/elements/Elements"
import { useNavigate } from "react-router-dom"
import { TextBox } from "src/shared/components/forms"
import PersonasExtraReserva from "src/pages/home/room-detail/Modals/PersonasExtraReserva/PersonasExtraReserva"
import { useDispatch, useSelector } from "react-redux"
import { selectRoomToReassign } from "src/store/roomDetails/reservadaSlice"
import { RootState } from "src/store/store"
import { AGREGAR_COMENTARIO_RESERVA } from "src/pages/home/graphql/mutations/booking"
import { useMutation } from "@apollo/client"
import useMiniSnackbar from "src/shared/hooks/useMiniSnackbar"
import { Estados_Habitaciones, useGetReservacionByIdLazyQuery } from "src/gql/schema"
import { useRoomMethods } from "src/pages/home/room-detail/hooks/methods"
import { useRoomDarwer } from "src/pages/home/room-detail/hooks/darwer"
import useSnackbar from "src/shared/hooks/useSnackbar"
import { toggleRoomDetailsDrawer } from "src/store/navigation/navigationSlice"
import { getOrigenLabel } from "src/pages/reservaciones/helpers/origen"
import IncidenciasItem from "src/pages/home/room-detail/sections/items/Incidencias"
import { formatDateComplitSlash } from "src/shared/hooks/formatDate-DD-MM-YY"
import { useProfile } from "src/shared/hooks/useProfile"
import useAuth, { RoleNames } from "src/shared/hooks/useAuth"
import AuthRequiredModal from "src/pages/inventario/modals/Auth/AuthRequiredModal/AuthRequiredModal"
import useIsColaboradorActive from "src/shared/hooks/useIsColaboradorActive"

const Details = ({ onReasignarHabitacion, isNoShow }: { onReasignarHabitacion: () => void; isNoShow: boolean }) => {
    const room = useRoom()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { rolName } = useProfile()
    const {InactiveModal, validateIsColabActive} = useIsColaboradorActive()

    const [isModalPersonaExtraOpen, setisModalPersonaExtraOpen] = useState<boolean>(false)
    const [isCommentMode, setIsCommentMode] = useState<boolean>(false)
    const [codigoOTA, setCodigoOTA] = useState<string>("")
    const { reservaSeleccionada } = useSelector((root: RootState) => root.roomDetails.reservada)
    const { onClose } = useRoomDarwer()
    const { freedomRoom } = useRoomMethods()
    const { showSnackbar } = useSnackbar()
    const [isFreeRoomModalOpen, setisFreeRoomModalOpen] = useState<boolean>(false)

    const handleConfirmFreeRoom = async (code: string, codeSample: string) => {
        try {
            const { data: update } = await freedomRoom(code, Estados_Habitaciones.Preparada, codeSample)
            if (update) {
                showSnackbar({
                    title: `Habitación preparada`,
                    text: `La habitación **${room?.nombre}** pasó de **reservada** a **preparada**`,
                    status: "success",
                })
                onClose()
                setisFreeRoomModalOpen(false)
            } else {
                showSnackbar({
                    title: "Error al liberar habitación",
                    status: "error",
                })
            }
        } catch (e) {
            const message: string = e?.message || ""
            setisFreeRoomModalOpen(false)
            if (message && message.includes("No se encontro el codigo indicado")) {
                showSnackbar({
                    title: "Código incorrecto",
                    status: "error",
                })
            } else {
                showSnackbar({
                    title: "Error al liberar habitación",
                    status: "error",
                })
            }
        }
    }

    const commentForm = useRef<HTMLFormElement>(null)

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm()

    useEffect(() => {
        dispatch(selectRoomToReassign({}))
    }, [])

    const [getReserva, { refetch: refetchReserva }] = useGetReservacionByIdLazyQuery()

    const [agregarComentarioReserva] = useMutation(AGREGAR_COMENTARIO_RESERVA)
    const { showMiniSnackbar } = useMiniSnackbar()

    const [comentarios, setComentarios] = useState<any>([])

    useEffect(() => {
        if (reservaSeleccionada?.reserva_id) {
            getReserva({
                variables: {
                    id: [reservaSeleccionada.reserva_id],
                },
            }).then((data) => {
                setCodigoOTA(data.data?.reservas?.[0].codigo_ota || "")
                setComentarios(data.data?.reservas?.[0].comentarios)
            })
        }
    }, [reservaSeleccionada])

    const onSubmitComment = (data) => {
        if (!data?.comentarios?.trim?.()) {
            return
        }
        agregarComentarioReserva({
            variables: {
                agregar_comentario_reserva: {
                    comentario: data?.comentarios,
                    reserva_id: reservaSeleccionada?.reserva_id,
                },
            },
        })
            .then(() => {
                showMiniSnackbar({
                    status: "success",
                    title: "Comentario agregado",
                    text: "Comentario agregado exitosamente",
                })
                refetchReserva().then((data) => {
                    setComentarios(data?.data?.reservas?.[0].comentarios)
                })
            })
            .catch(() => {
                showMiniSnackbar({
                    title: "Error al agregar comentario",
                    text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                    status: "error",
                })
            })
    }

    const triggerCommentSubmit = () => {
        handleSubmit(onSubmitComment)()
        reset()
        setIsCommentMode(false)
    }

    // TODO: algunas mutaciones tienen el pin o huella como obligatorio pero ahora se necesita quitar si el usuario es admin
    const { Modal, skip } = useAuth({
        authModal: (
            <AuthRequiredModal
                isOpen={isFreeRoomModalOpen}
                onAuthFilled={(value, sampleData) => handleConfirmFreeRoom(value || "", sampleData || "")}
                onClose={() => setisFreeRoomModalOpen(false)}
            />
        ),
        authorizedRoles: [RoleNames.admin, RoleNames.superadmin],
        isOpen: isFreeRoomModalOpen,
        onClose: () => setisFreeRoomModalOpen(false),
    })

    return (
        <div className="tab__reservada__detalles__container">
            <div className="tab__reservada__detalles__main" style={{ height: isNoShow ? "calc(100dvh - 310px)" : "" }}>
                <DescriptionDetail
                    icon="calendarFill"
                    label="Fecha de estancia"
                    style={{
                        width: "100%",
                        padding: "12px",
                    }}
                    value={
                        formatDateComplitSlash(reservaSeleccionada?.fecha_entrada || "") +
                        " - " +
                        formatDateComplitSlash(reservaSeleccionada?.fecha_salida || "")
                    }
                />
                <DescriptionDetail
                    icon="Origin"
                    label="Origen de la reserva"
                    style={{
                        width: "100%",
                        padding: "12px",
                    }}
                    value={reservaSeleccionada?.origen ? getOrigenLabel(reservaSeleccionada?.origen) : "-"}
                />
                {codigoOTA && (
                    <DescriptionDetail
                        icon="HashWhite"
                        label="Código de reserva OTA"
                        style={{
                            width: "100%",
                            padding: "12px",
                        }}
                        value={codigoOTA || "-"}
                    />
                )}

                <DescriptionDetail
                    icon="userFilled"
                    label="Nombre completo del huésped"
                    style={{
                        width: "100%",
                        padding: "12px",
                    }}
                    value={String(reservaSeleccionada?.nombre_huesped) || "-"}
                />
                {reservaSeleccionada?.telefono_huesped && (
                    <DescriptionDetail
                        icon="phone"
                        label="Teléfono"
                        style={{
                            width: "100%",
                            padding: "12px",
                        }}
                        value={String(reservaSeleccionada?.telefono_huesped) || "-"}
                    />
                )}
                {reservaSeleccionada?.correo_huesped && (
                    <DescriptionDetail
                        icon="mailOpenFill"
                        label="Correo"
                        style={{
                            width: "100%",
                            padding: "12px",
                        }}
                        value={String(reservaSeleccionada?.correo_huesped) || "-"}
                    />
                )}
                {!!reservaSeleccionada?.experiencias_reserva?.length && (
                    <ItemMultiplePayment
                        showAmounts={false}
                        icon={"star"}
                        label={"Experiencias"}
                        style={{
                            width: "100%",
                            padding: "12px",
                        }}
                        labelClass="detalle-h-items__multiple__text--experience"
                        payments={
                            reservaSeleccionada?.experiencias_reserva?.map((s) => ({
                                label: s.experiencia?.nombre || "",
                            })) || []
                        }
                    />
                )}
                <DescriptionDetail
                    icon="UserParentFill"
                    label="Personas"
                    style={{
                        width: "100%",
                        padding: "12px",
                    }}
                    link={
                        Number(reservaSeleccionada?.tarifa?.personas_extra_max) -
                            Number(reservaSeleccionada?.personas_extras) >
                            0 &&
                        !isNoShow &&
                        rolName !== RoleNames.valet &&
                        rolName !== RoleNames.mantenimiento && rolName !== RoleNames.monitoreo
                            ? "Agregar"
                            : undefined
                    }
                    onLink={validateIsColabActive(() => setisModalPersonaExtraOpen(true))}
                    value={
                        (reservaSeleccionada?.numero_personas || 0) +
                            (reservaSeleccionada?.personas_extras || 0) +
                            "" || "-"
                    }
                />
                <IncidenciasItem />
                <form onSubmit={handleSubmit(onSubmitComment)} ref={commentForm}>
                    <DescriptionDetail
                        icon="communication"
                        label="Comentarios"
                        style={{
                            width: "100%",
                            padding: "0 12px",
                        }}
                        link={
                            rolName === RoleNames.mantenimiento || rolName === RoleNames.monitoreo
                                ? undefined
                                : isNoShow
                                ? ""
                                : isCommentMode
                                ? "Guardar"
                                : "Agregar"
                        }
                        onLink={
                         rolName === RoleNames.monitoreo
                                ? undefined
                                : validateIsColabActive(() => {
                                    if (isCommentMode) {
                                        triggerCommentSubmit()
                                        return
                                    }
                                    setIsCommentMode(true)
                                })
                        }
                        value={""}
                    />
                    <ItemMultiplePayment
                        icon={""}
                        showAmounts={false}
                        label={""}
                        payments={
                            comentarios?.map((c) => ({
                                label: c.comentario,
                            })) || []
                        }
                    />
                    {isCommentMode && (
                        <Controller
                            control={control}
                            name={"comentarios"}
                            render={({ field: { onChange, value } }) => (
                                <TextBox
                                    className="tab__reservada__detalles__textbox"
                                    placeholder="Escribe un comentario..."
                                    onChange={(value) => {
                                        if (value.target.value.length > 0) onChange(value.target.value)
                                        else onChange(undefined)
                                    }}
                                    errorHintText={errors.comentarios ? "Ingresa un comentario" : undefined}
                                    error={errors.comentarios ? true : false}
                                    value={value || ""}
                                />
                            )}
                        />
                    )}
                </form>
            </div>
            {isModalPersonaExtraOpen && (
                <PersonasExtraReserva
                    onClose={(data) => {
                        setisModalPersonaExtraOpen(false)
                    }}
                    onConfirmed={() => dispatch(toggleRoomDetailsDrawer(false))}
                />
            )}
            <div className="tab__reservada__detalles__footer">
                {[RoleNames.valet, RoleNames.mantenimiento].map(String).includes(rolName) ? isNoShow ? (
                    <PrimaryButton
                        text={"Liberar habitación"}
                        onClick={validateIsColabActive(() => (skip ? handleConfirmFreeRoom("", "") : setisFreeRoomModalOpen(true)))}
                        style={{ marginBottom: "12px" }}
                    />
                ) : (
                    <PrimaryButton
                        text={"Check in"}
                        onClick={validateIsColabActive(() =>
                            navigate(`/u/venta-habitacion/${room?.habitacion_id}`, {
                                state: { reservaSeleccionada },
                            })
                        )}
                        style={{ marginBottom: "12px" }}
                    />
                ) : <></>}
                {![RoleNames.valet, RoleNames.mantenimiento, RoleNames.monitoreo].map(String).includes(rolName) ? isNoShow ? (
                    <PrimaryButton
                        text={"Liberar habitación"}
                        onClick={validateIsColabActive(() => (skip ? handleConfirmFreeRoom("", "") : setisFreeRoomModalOpen(true)))}
                        style={{ marginBottom: "12px" }}
                    />
                ) : (
                    <>
                        <PrimaryButton
                            text={"Check in"}
                            onClick={validateIsColabActive(() =>
                                navigate(`/u/venta-habitacion/${room?.habitacion_id}`, {
                                    state: { reservaSeleccionada },
                                })
                            )}
                            style={{ marginBottom: "12px" }}
                        />
                        <SecondaryButton text={"Cambiar habitación"} onClick={validateIsColabActive(() => onReasignarHabitacion?.())} />
                    </>
                ) : <></>}

                {Modal}
            </div>
            {InactiveModal}
        </div>
    )
}

export default Details
