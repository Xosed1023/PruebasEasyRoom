import React, { useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import Screen from "src/shared/components/layout/screen/Screen"
import { useDispatch } from "react-redux"
import { startGetSelectedRoom } from "src/pages/home/store/thunks/rooms.thunk"
import { RoomStatus } from "src/pages/home/components/RoomCard/enums/RoomStatus.enum"

import BoxOption from "src/shared/components/forms/box-option/BoxOption"
import { PrimaryButton } from "../../sections/elements/Elements"
import { toggleRoomDetailsDrawer } from "src/store/navigation/navigationSlice"
import useSnackbar from "src/shared/hooks/useSnackbar"
import { Controller, useForm } from "react-hook-form"
import Dropdown from "src/shared/components/forms/selelct-dropdown/Dropdown"
import { useColaborador } from "../../hooks/colaborador"
import { assignColaborador } from "../../helpers/colaborador"
import { usePuestos } from "../../hooks/usePuestos"
import { useLazyQuery } from "@apollo/client"
import { GET_ROOM } from "src/pages/home/graphql/queries/rooms.query"
import {
    Habitacion,
    useCancelarRentaHabitacionMutation,
    useCheckoutMutation,
    Estados_Habitaciones,
    TiposTarea,
} from "src/gql/schema"
import { useProfile } from "src/shared/hooks/useProfile"
import { Puestos } from "src/constants/puestos"
import { useRoomMethods } from "../../hooks/methods"
import LockRoom from "../../Modals/LockRoom/LockRoom"
import LoaderComponent from "src/shared/components/layout/loader/Loader"
import MultipleSelectDropdown from "src/shared/components/forms/MultipleSelectDropdown/MultipleSelectDropdown"
import { useRoom } from "../../hooks"
import { usePrintTicket } from "src/shared/hooks/print"
import { useCurrentDateQuery } from "src/gql/schema"

const Cancelada = () => {
    const { habitacion_id = "" } = useParams()
    const {
        state: { motivoCancelacion, extras, cancelar_estancia, renta_id, ordenes, origen },
    } = useLocation()

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { data: recamaristas } = useColaborador([Puestos.RECAMARISTA, Puestos.SUPERVISOR])
    const { data: supervisor } = useColaborador(Puestos.SUPERVISOR)
    const puestos = usePuestos()
    const [isLockRoomModalOpen, setIsLockRoomModalOpen] = useState(false)
    const { updateStatus } = useRoomMethods()
    const [cancelarRenta] = useCancelarRentaHabitacionMutation()
    const [getHabitacion] = useLazyQuery<{ habitacion: Habitacion }>(GET_ROOM)
    const room = useRoom()
    const { usuario_id } = useProfile()

    const [habitacion, setHabitacion] = useState<any>()
    const { data } = useCurrentDateQuery()

    useEffect(() => {
        getHabitacion({
            variables: { habitacion_id, usuario_id },
        }).then(({ data }) => {
            setHabitacion(data)
        })
    }, [habitacion_id])

    const {
        handleSubmit,
        control,
        watch,
        formState: { errors },
        getValues,
        setValue,
    } = useForm()

    const { showSnackbar } = useSnackbar()
    const statusSelected = watch("status") === undefined ? "sucia" : watch("status")
    const [checkout] = useCheckoutMutation()
    const { handlePrint } = usePrintTicket()

    const [isLoading, setisLoading] = useState(false)

    useEffect(() => {
        dispatch(startGetSelectedRoom(habitacion_id))
    }, [])

    useEffect(() => {
        setValue("status", "sucia")
        setValue("tipo_limpieza", undefined)
        setValue("camarista", undefined)
        setValue("supervision", undefined)
        // si el estado es vacio probablemente viene de un refresh o de un back
        if (!habitacion?.habitacion.estado) {
            return
        }
        // Si una habitacion no esta en limpia no deberia acceder a esta pag
        if ((habitacion.habitacion.estado as any) !== RoomStatus.occupied) {
            return navigate("/u")
        }
    }, [habitacion])

    const closePage = () => {
        if(origen === "cortes"){
            navigate("/u/cortes", { replace: true })
            return
        }
        navigate("/u", { replace: true })
        dispatch(toggleRoomDetailsDrawer(false))
    }

    const onSubmit = async (formData) => {
        if (!habitacion || isLoading) {
            return
        }
        cancelarRenta({
            variables: {
                datos_cancelar: {
                    cancelar_renta: cancelar_estancia,
                    motivo_cancelacion: motivoCancelacion,
                    renta_id,
                    usuario_id,
                    extras,
                    ordenes: ordenes || null
                },
            },
        })
            .then(async ({ data: dataCancelar }) => {
                const ticket_id = dataCancelar?.cancelar_operaciones_renta.ticket_id
                if (ticket_id) {
                    ticket_id.map((ticket) => {
                        handlePrint(ticket, "original")
                    })
                }

                if (statusSelected === RoomStatus.unclean) {
                    const { data: dataUnclean } = await updateStatus(statusSelected)
                    if (dataUnclean) {
                        showSnackbar({
                            title: "Habitación cancelada",
                            status: "success",
                            text: `La habitación **${habitacion?.habitacion?.numero_habitacion}** pasará a **sucia**.`,
                        })
                        closePage()
                    }
                    setisLoading(false)
                    return
                }
                if (statusSelected === RoomStatus.cleaning) {
                    await updateStatus(statusSelected)
                    assignColaborador({
                        datos_tarea: {
                            nombre: "Limpieza de habitación",
                            descripcion: "Limpieza de habitación",
                            puesto_id: puestos.find((p) => p?.nombre === Puestos.RECAMARISTA)?.puesto_id || "",
                            tipo: TiposTarea.Limpieza,
                        },
                        datos_colaborador_tarea: {
                            colaborador_ids: formData.camarista.map((c) => c.value),
                            descripcion_tarea: "Limpieza de habitación",
                            habitacion_id: habitacion_id,
                            tipo_limpieza: getValues().tipo_limpieza,
                        },
                        usuario_id,
                        estadoHabitacion: statusSelected,
                    })
                        .then((values) => {
                            showSnackbar({
                                title: "Habitación cancelada",
                                status: "success",
                                text: `La habitación **${habitacion?.habitacion?.numero_habitacion}** pasará a **limpieza**.`,
                            })
                            closePage()
                        })
                        .catch(() => {
                            showSnackbar({
                                title: "Error al pasara a limpieza",
                                status: "error",
                                text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente",
                            })
                            closePage()
                        })
                        .finally(() => {
                            closePage()
                            setisLoading(false)
                            dispatch(toggleRoomDetailsDrawer(false))
                        })
                    return
                }
                if (statusSelected === RoomStatus.supervision) {
                    await updateStatus(statusSelected)
                    const descripcion = `Supervisión de la habitación ${room?.nombre}`
                    assignColaborador({
                        datos_tarea: {
                            descripcion: descripcion,
                            nombre: "Supervisión de habitación",
                            puesto_id: puestos.find((p) => p?.nombre === Puestos.RECAMARISTA)?.puesto_id || "",
                            tipo: TiposTarea.Supervision,
                        },
                        datos_colaborador_tarea: {
                            colaborador_ids: [formData.supervision],
                            descripcion_tarea: descripcion,
                            habitacion_id: room?.habitacion_id,
                        },
                        usuario_id,
                        estadoHabitacion: statusSelected,
                    })
                        .then((values) => {
                            showSnackbar({
                                title: "Habitación cancelada",
                                status: "success",
                                text: `La habitación **${habitacion?.habitacion?.numero_habitacion}** pasará a **supervisión**.`,
                            })
                            closePage()
                        })
                        .catch(() => {
                            showSnackbar({
                                title: "Error al pasar a supervisión",
                                status: "error",
                                text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente",
                            })
                            closePage()
                        })
                        .finally(() => {
                            closePage()
                            setisLoading(false)
                            dispatch(toggleRoomDetailsDrawer(false))
                        })
                    return
                }
                if (statusSelected === RoomStatus.supervisionPending) {
                    const { data: dataPending } = await updateStatus(statusSelected)
                    if (dataPending) {
                        showSnackbar({
                            title: "Habitación cancelada",
                            status: "success",
                            text: `La habitación **${habitacion?.habitacion?.numero_habitacion}** pasará a **pendiente de supervisión**.`,
                        })
                        closePage()
                    }
                    setisLoading(false)
                    return
                }
            })
            .catch(() => {
                showSnackbar({
                    title: "Error al cancelar renta",
                    status: "error",
                    text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente",
                })
            })
    }

    return (
        <Screen close={true} title="" onClose={() => closePage()} back>
            <form className="end-checkout__content" onSubmit={handleSubmit(onSubmit)}>
                <span className="end-checkout__title">
                    <p className="end-checkout__title" style={{ marginBottom: 10, textAlign: "center" }}>
                        Después de la cancelación
                    </p>
                    ¿Qué estado deseas asignar a la habitación {habitacion?.habitacion?.numero_habitacion}?
                </span>
                <Controller
                    control={control}
                    name={"status"}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                        <div className="end-checkout__options">
                            <div className="end-checkout__options-item">
                                <BoxOption
                                    active={statusSelected === RoomStatus.unclean}
                                    className=""
                                    icon="trashFilled"
                                    label="Sucia"
                                    iconWithCircle={true}
                                    onClick={() => {
                                        onChange(RoomStatus.unclean)
                                    }}
                                    style={{
                                        height: 156,
                                        width: 260,
                                    }}
                                />
                            </div>
                            <div className="end-checkout__options-item">
                                <BoxOption
                                    active={statusSelected === RoomStatus.cleaning}
                                    className=""
                                    icon="broom"
                                    iconWithCircle={true}
                                    label="Limpieza"
                                    onClick={() => {
                                        onChange(RoomStatus.cleaning)
                                    }}
                                    style={{
                                        height: 156,
                                        width: 260,
                                    }}
                                />
                            </div>
                            <div className="end-checkout__options-item">
                                <BoxOption
                                    active={statusSelected === RoomStatus.supervision}
                                    className=""
                                    icon="Search"
                                    iconWithCircle={true}
                                    label="Supervisar"
                                    onClick={() => {
                                        onChange(RoomStatus.supervision)
                                    }}
                                    style={{
                                        height: 156,
                                        width: 260,
                                    }}
                                />
                            </div>
                            <div className="end-checkout__options-item">
                                <BoxOption
                                    active={statusSelected === RoomStatus.supervisionPending}
                                    className=""
                                    icon="SearchWatch"
                                    iconWithCircle={true}
                                    label="Pendiente de supervisión"
                                    onClick={() => {
                                        onChange(RoomStatus.supervisionPending)
                                    }}
                                    style={{
                                        height: 156,
                                        width: 260,
                                        textAlign: "center",
                                    }}
                                />
                            </div>
                        </div>
                    )}
                />
                {statusSelected === RoomStatus.cleaning && (
                    <div className="end-checkout__dropdown__container">
                        <Controller
                            control={control}
                            name={"camarista"}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                                <MultipleSelectDropdown<{
                                    label: string
                                    value: string
                                }>
                                    icon="userFilled"
                                    containerStyle={{
                                        width: "435px",
                                    }}
                                    maxSelections={4}
                                    containerClassName="end-checkout--cleaning__dropdown"
                                    errorHintText={errors.camarista ? "Selecciona una camarista" : undefined}
                                    value={value}
                                    label="Camaristas disponibles"
                                    placeholder="Selecciona una opción"
                                    onChange={(value) => {
                                        onChange(value)
                                    }}
                                    options={recamaristas?.map((r) => {
                                        return {
                                            withCheckbox: true,
                                            withPhoto: true,
                                            value: { label: r.nombre, value: r.colaborador_id },
                                            label: r.nombre,
                                            photoSrc: r.foto,
                                        }
                                    })}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name={"tipo_limpieza"}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                                <Dropdown
                                    icon="broom"
                                    className="end-checkout--cleaning__dropdown"
                                    errorHintText={errors.tipo_limpieza ? "Selecciona un tipo de limpieza" : undefined}
                                    value={value}
                                    label="Tipo de limpieza"
                                    placeholder="Selecciona una opción"
                                    onClick={(value) => {
                                        onChange(value.value)
                                    }}
                                    options={[
                                        { label: "Normal", value: "normal" },
                                        { label: "Detallada", value: "detallada" },
                                        { label: "Retoque", value: "retoque" },
                                    ]}
                                />
                            )}
                        />
                    </div>
                )}
                {statusSelected === RoomStatus.supervision && (
                    <div className="end-checkout__dropdown__container">
                        <Controller
                            control={control}
                            name={"supervision"}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                                <Dropdown
                                    className="end-checkout--cleaning__dropdown"
                                    value={value}
                                    onClick={(value) => {
                                        onChange(value.value)
                                    }}
                                    label="Supervisores disponibles"
                                    placeholder="Selecciona una opción"
                                    icon="userFilled"
                                    options={supervisor?.map(({ nombre, colaborador_id }) => {
                                        return {
                                            label: nombre,
                                            value: colaborador_id,
                                        }
                                    })}
                                    iconInOptions={false}
                                    errorHintText={errors.supervision ? "Selecciona un personal" : ""}
                                />
                            )}
                        />
                    </div>
                )}
                <PrimaryButton className="end-checkout__confirm-button" text={"Continuar"} type="submit" />
                <LockRoom
                    isOpen={isLockRoomModalOpen}
                    onClose={() => setIsLockRoomModalOpen(false)}
                    onConfirmed={async () => {
                        setisLoading(true)
                        await checkout({
                            variables: {
                                checkOutInput: {
                                    renta_id: habitacion?.habitacion?.ultima_renta?.renta_id,
                                    usuario_id,
                                    estado_habitacion: Estados_Habitaciones.Bloqueada,
                                    fecha_estado: data?.serverDate,
                                },
                            },
                        })
                        closePage()
                        setisLoading(false)
                    }}
                />
            </form>
            <LoaderComponent visible={isLoading} />
        </Screen>
    )
}

export default Cancelada
