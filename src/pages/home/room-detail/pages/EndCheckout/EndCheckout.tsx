import { useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import Screen from "src/shared/components/layout/screen/Screen"
import { useDispatch } from "react-redux"
import { startGetSelectedRoom } from "src/pages/home/store/thunks/rooms.thunk"
import { RoomStatus } from "src/pages/home/components/RoomCard/enums/RoomStatus.enum"

import "./EndCheckout.css"
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
    useCheckoutMutation,
    useAbonarSaldoEasyrewardsMutation,
    Estados_Habitaciones,
    TiposTarea,
} from "src/gql/schema"

import { useProfile } from "src/shared/hooks/useProfile"
import { Puestos } from "src/constants/puestos"
//import { useRoomMethods } from "../../hooks/methods"
import LockRoom from "../../Modals/LockRoom/LockRoom"
import LoaderComponent from "src/shared/components/layout/loader/Loader"
import MultipleSelectDropdown from "src/shared/components/forms/MultipleSelectDropdown/MultipleSelectDropdown"
import { useModulos } from "src/shared/hooks/useModulos"
import { tiposPagosValidos } from "src/pages/easyrewards/utils/AbonarEasyRewards"
import { v4 as uuid } from "uuid"
import { useCurrentDateQuery } from "src/gql/schema"
import { useTiposMantenimientoContext } from "src/shared/providers/TiposMantenimientoProvider"

const EndCheckout = () => {
    const { habitacion_id = "" } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()
    const { data: recamaristas } = useColaborador([Puestos.RECAMARISTA, Puestos.SUPERVISOR])
    const { data: usersMantenimiento } = useColaborador("Mantenimiento")
    const [nameSelected, setnameSelected] = useState("")
    const puestos = usePuestos()
    const [isLockRoomModalOpen, setIsLockRoomModalOpen] = useState(false)
    //const { updateStatus } = useRoomMethods()
    const { tiposMantenimiento } = useTiposMantenimientoContext()
    const [getHabitacion] = useLazyQuery<{ habitacion: Habitacion }>(GET_ROOM)

    const [habitacion, setHabitacion] = useState<any>()

    const { easyRewards: withEasyrewards } = useModulos()

    useEffect(() => {
        getHabitacion({
            variables: { habitacion_id, usuario_id, hotel_id },
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
    const { usuario_id, hotel_id } = useProfile()
    const statusSelected = watch("status") === undefined ? "sucia" : watch("status")
    const [checkout] = useCheckoutMutation()

    const [isLoading, setisLoading] = useState(false)

    const [abonarSaldoEasyrewards] = useAbonarSaldoEasyrewardsMutation()

    const { data } = useCurrentDateQuery()

    useEffect(() => {
        dispatch(startGetSelectedRoom(habitacion_id))
    }, [])

    useEffect(() => {
        setValue("status", "sucia")
        setValue("tipo_limpieza", undefined)
        setValue("camarista", undefined)
        setValue("mantenimiento", undefined)
        setValue("motivo_mantenimiento", undefined)
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
        navigate("/u")
        dispatch(toggleRoomDetailsDrawer(false))
    }

    const { montoTotalBebidas, montoTotalAlimentos, montoTotalSexAndSpa } = location.state || {}

    const calcularTotalPagos = (pagos) => {
        return pagos.reduce((acc, pago) => {
            const subtotalPago =
                pago.detalles_pago?.reduce((subAcc, detalle) => {
                    if (tiposPagosValidos.includes(detalle.tipo_pago)) {
                        const subtotal = detalle.subtotal || 0
                        return subAcc + subtotal
                    }
                    return subAcc
                }, 0) || 0
            return acc + subtotalPago
        }, 0)
    }
    const filtrarPagosEstanciaValidos = (pagos) => {
        return pagos.filter((pago) => {
            const pagoOrden = habitacion?.habitacion.ultima_renta?.ordenes?.some(
                (orden) => orden.pago_id === pago.pago_id
            )
            return !pagoOrden && pago.detalles_pago?.some((detalle) => tiposPagosValidos.includes(detalle.tipo_pago))
        })
    }
    const calcularEstanciaYExtras = (() => {
        const totalEstancia =
            habitacion?.habitacion.ultima_renta?.subtotales?.total_habitacion +
                habitacion?.habitacion.ultima_renta?.subtotales?.total_hospedajes_extra +
                habitacion?.habitacion.ultima_renta?.subtotales?.total_horas_extra || 0
        const totalExtra = habitacion?.habitacion.ultima_renta?.subtotales?.total_personas_extra || 0
        const pagosValidos = filtrarPagosEstanciaValidos(habitacion?.habitacion.ultima_renta?.pagos || [])
        const totalPagosValidos = calcularTotalPagos(pagosValidos)
        const montoTotalEstancia = totalPagosValidos - totalExtra || 0
        const montoTotalExtra = totalPagosValidos - totalEstancia || 0
        return { montoTotalEstancia, montoTotalExtra }
    })()
    const { montoTotalEstancia, montoTotalExtra } = calcularEstanciaYExtras

    const onSubmit = async (formData) => {
        if (!habitacion || isLoading) {
            return
        }
        const easyrewardsIdHabitacion =
            habitacion?.habitacion?.ultima_renta?.pagos
                ?.find((pago) => pago?.detalles_pago?.some((detalle) => detalle?.easyrewards_id))
                ?.detalles_pago?.find((detalle) => detalle?.easyrewards_id)?.easyrewards_id ??
            habitacion?.habitacion?.ultima_renta?.easyrewards_id ??
            ""
        if (habitacion?.habitacion?.ultima_renta?.ticket_id && withEasyrewards && easyrewardsIdHabitacion !== "") {
            const abonar = async () => {
                try {
                    const { data } = await abonarSaldoEasyrewards({
                        variables: {
                            easyrewards_id: easyrewardsIdHabitacion,
                            hotel_id: habitacion?.habitacion?.hotel_id,
                            folio_ticket: habitacion?.habitacion?.ultima_renta?.ticket_id,
                            monto_alimentos: montoTotalAlimentos,
                            monto_bebidas: montoTotalBebidas,
                            monto_extras: montoTotalExtra,
                            monto_habitacion: montoTotalEstancia,
                            monto_sexspa: montoTotalSexAndSpa,
                            origen: 0,
                        },
                    })
                    if (data?.acumula_puntos?.saldo !== undefined && data?.acumula_puntos?.saldo !== null) {
                        const montoAbono =
                            (montoTotalAlimentos +
                                montoTotalBebidas +
                                montoTotalExtra +
                                montoTotalEstancia +
                                montoTotalSexAndSpa) *
                            0.05
                        showSnackbar({
                            status: "success",
                            title: "Abono realizado con éxito",
                            text: `Se abonaron <strong>${Math.round(
                                montoAbono
                            )} puntos</strong> al programa de lealtad <strong>ID ${easyrewardsIdHabitacion}</strong>`,
                        })
                    }
                } catch (e) {
                    console.log(e)
                }
            }
            abonar()
        }

        const handleCheckout = async (estado_habitacion: Estados_Habitaciones) => {
            setisLoading(true)
            return checkout({
                variables: {
                    checkOutInput: {
                        renta_id: habitacion?.habitacion?.ultima_renta?.renta_id,
                        usuario_id: usuario_id,
                        estado_habitacion: estado_habitacion,
                        fecha_estado: data?.serverDate,
                    },
                },
            })
        }

        const handleErrorColaborador = () => {
            return showSnackbar({
                title: "Error al crear asignar colaborador",
                status: "error",
                text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente",
            })
        }

        async function handleUncleanStatus() {
            try {
                const { data, errors } = await handleCheckout(Estados_Habitaciones.Sucia)
                if (data?.CheckOut?.ticket_id) {
                    showSnackbar({
                        status: "success",
                        title: "Habitación sucia",
                        text: `La habitación **${habitacion?.habitacion.tipo_habitacion?.nombre} ${habitacion?.habitacion?.numero_habitacion}** pasó de **ocupada a sucia**`,
                    })
                } else {
                    showSnackbar({
                        title: "Error al marcar como sucia",
                        status: "error",
                        text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                    })
                    console.log(errors)
                }
            } catch (e) {
                console.log(e)
                showSnackbar({
                    title: "Error al marcar como sucia",
                    status: "error",
                    text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                })
            } finally {
                closePage()
                setisLoading(false)
            }
        }

        switch (statusSelected) {
            case RoomStatus.unclean:
                await handleUncleanStatus()
                return

            case RoomStatus.cleaning:
                try {
                    const { data: resCheckout, errors } = await handleCheckout(Estados_Habitaciones.Limpieza)
                    if (resCheckout?.CheckOut.ticket_id) {
                        const resColaborador = await assignColaborador({
                            datos_tarea: {
                                nombre: "Limpieza de habitación",
                                descripcion: "Limpieza de habitación",
                                puesto_id: puestos.find((p) => p?.nombre === Puestos.RECAMARISTA)?.puesto_id || "",
                                tipo: TiposTarea.Limpieza,
                            },
                            datos_colaborador_tarea: {
                                colaborador_ids: formData.camarista,
                                descripcion_tarea: "Limpieza de habitación",
                                habitacion_id: habitacion_id,
                                tipo_limpieza: getValues().tipo_limpieza,
                            },
                            usuario_id,
                            hotel_id,
                            estadoHabitacion: statusSelected,
                        })
                        if (resColaborador) {
                            showSnackbar({
                                status: "success",
                                title: `Limpieza de habitación ${habitacion?.habitacion?.tipo_habitacion?.nombre} ${habitacion?.habitacion?.numero_habitacion}`,
                                text: `**${nameSelected}** comenzará con la **limpieza ${
                                    formData.tipo_limpieza === "normal"
                                        ? "normal de 30 min"
                                        : formData.tipo_limpieza === "detallada"
                                        ? "detallada de 60 min"
                                        : formData.tipo_limpieza === "retoque"
                                        ? "retoque de 15 min"
                                        : ""
                                }** en la habitación **${habitacion?.habitacion?.tipo_habitacion?.nombre} ${
                                    habitacion?.habitacion?.numero_habitacion
                                }.**`,
                            })
                        } else {
                            handleErrorColaborador()
                        }
                    } else {
                        console.log(errors)
                        showSnackbar({
                            title: "Error al crear asignar limpieza",
                            status: "error",
                            text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente",
                        })
                    }
                } catch {
                    showSnackbar({
                        title: "Error al crear asignar limpieza",
                        status: "error",
                        text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente",
                    })
                } finally {
                    closePage()
                    setisLoading(false)
                    dispatch(toggleRoomDetailsDrawer(false))
                }
                return

            case RoomStatus.maintenance:
                try {
                    const { data: resCheckout } = await handleCheckout(Estados_Habitaciones.Mantenimiento)
                    if (resCheckout?.CheckOut.ticket_id) {
                        const description = `Mantenimiento de la habitación`
                        if (formData.mantenimiento === "omit") {
                            const resColaborador = await assignColaborador({
                                datos_tarea: {
                                    nombre: description,
                                    descripcion: formData.motivo_mantenimiento,
                                    puesto_id: puestos.find((p) => p?.nombre === "Mantenimiento")?.puesto_id || "",
                                    tipo: TiposTarea.Mantenimiento,
                                },
                                datos_colaborador_tarea: {
                                    colaborador_ids: [],
                                    descripcion_tarea: formData.motivo_mantenimiento,
                                    habitacion_id: habitacion_id,
                                },
                                usuario_id,
                                hotel_id,
                                estadoHabitacion: statusSelected,
                            })
                            if (resColaborador) {
                                showSnackbar({
                                    status: "success",
                                    title: "Habitación en mantenimiento",
                                    text: `La habitación **${habitacion?.habitacion?.tipo_habitacion?.nombre} ${habitacion?.habitacion?.numero_habitacion}** se marcó como mantenimiento sin asignar personal.`,
                                })
                            } else {
                                handleErrorColaborador()
                            }
                        } else {
                            const resColaborador = await assignColaborador({
                                datos_tarea: {
                                    nombre: description,
                                    descripcion: formData.motivo_mantenimiento,
                                    puesto_id: puestos.find((p) => p?.nombre === "Mantenimiento")?.puesto_id || "",
                                    tipo: TiposTarea.Mantenimiento,
                                },
                                datos_colaborador_tarea: {
                                    colaborador_ids: [formData.mantenimiento],
                                    descripcion_tarea: description,
                                    habitacion_id: habitacion_id,
                                },
                                usuario_id,
                                hotel_id,
                                estadoHabitacion: statusSelected,
                            })
                            if (resColaborador) {
                                showSnackbar({
                                    status: "success",
                                    title: "Habitación en mantenimiento",
                                    text: `**${nameSelected}** comenzará con el mantenimiento de la habitación **${habitacion?.habitacion?.tipo_habitacion?.nombre} ${habitacion?.habitacion?.numero_habitacion}.**`,
                                })
                            } else {
                                handleErrorColaborador()
                            }
                        }
                    } else {
                        showSnackbar({
                            title: "Error al crear asignar limpieza",
                            status: "error",
                            text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente",
                        })
                    }
                } catch {
                    showSnackbar({
                        title: "Error al crear asignar mantenimiento",
                        status: "error",
                        text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente",
                    })
                } finally {
                    setisLoading(false)
                    dispatch(toggleRoomDetailsDrawer(false))
                    closePage()
                }
                return

            case RoomStatus.blocked:
                setisLoading(false)
                setIsLockRoomModalOpen(true)
                return

            default:
                await handleUncleanStatus()
                return
        }
    }

    return (
        <Screen close={true} title="" onClose={() => closePage()} back>
            <form className="end-checkout__content" onSubmit={handleSubmit(onSubmit)}>
                <span className="end-checkout__title">
                    <p className="end-checkout__title" style={{ marginBottom: 10, textAlign: "center" }}>
                        Después del check out
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
                                    active={statusSelected === RoomStatus.maintenance}
                                    className=""
                                    icon="tools"
                                    iconWithCircle={true}
                                    label="Mantenimiento"
                                    onClick={() => {
                                        onChange(RoomStatus.maintenance)
                                    }}
                                    style={{
                                        height: 156,
                                        width: 260,
                                    }}
                                />
                            </div>
                            <div className="end-checkout__options-item">
                                <BoxOption
                                    active={statusSelected === RoomStatus.blocked}
                                    className=""
                                    icon="LockFill"
                                    iconWithCircle={true}
                                    label="Bloqueo"
                                    onClick={() => {
                                        onChange(RoomStatus.blocked)
                                    }}
                                    style={{
                                        height: 156,
                                        width: 260,
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
                                <MultipleSelectDropdown<string>
                                    editable={true}
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
                                    options={[
                                        ...(recamaristas?.map((r) => ({
                                            id: uuid(),
                                            withCheckbox: true,
                                            withPhoto: true,
                                            value: r.colaborador_id,
                                            label: `${r.nombre} `,
                                            photoSrc: r.foto,
                                        })) || []),
                                    ]}
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
                {statusSelected === RoomStatus.maintenance && (
                    <div className="end-checkout__dropdown__container">
                        <Controller
                            control={control}
                            name={"motivo_mantenimiento"}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                                <Dropdown
                                    icon="tools"
                                    className="end-checkout--cleaning__dropdown"
                                    errorHintText={errors.motivo_mantenimiento ? "Selecciona un motivo" : undefined}
                                    value={value}
                                    label="Motivo de mantenimiento"
                                    placeholder="Selecciona un motivo"
                                    onClick={(value) => {
                                        onChange(value.value)
                                        setnameSelected(value.label)
                                    }}
                                    options={tiposMantenimiento?.map((m) => {
                                        return {
                                            value: m.nombre,
                                            label: m.nombre,
                                        }
                                    })}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name={"mantenimiento"}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                                <Dropdown
                                    icon="userFilled"
                                    className="end-checkout--cleaning__dropdown"
                                    errorHintText={errors.mantenimiento ? "Selecciona un personal" : undefined}
                                    value={value}
                                    label="Personal disponible"
                                    placeholder="Selecciona tu personal"
                                    onClick={(value) => {
                                        onChange(value.value)
                                        setnameSelected(value.label)
                                    }}
                                    options={[
                                        {
                                            value: "omit",
                                            label: "Omitir selección de personal",
                                            icon: "UserUnfollow",
                                        },
                                        ...(usersMantenimiento?.map((m) => ({
                                            value: m.colaborador_id,
                                            label: m.nombre,
                                            icon: "userFilled",
                                        })) || []),
                                    ]}
                                />
                            )}
                        />
                    </div>
                )}
                <PrimaryButton className="end-checkout__confirm-button" text={"Continuar"} type="submit" />
                <LockRoom
                    isOpen={isLockRoomModalOpen}
                    onClose={() => setIsLockRoomModalOpen(false)}
                    onConfirmed={() => {
                        setisLoading(true)
                        checkout({
                            variables: {
                                checkOutInput: {
                                    renta_id: habitacion?.habitacion?.ultima_renta?.renta_id,
                                    usuario_id,
                                    estado_habitacion: Estados_Habitaciones.Bloqueada,
                                    fecha_estado: data?.serverDate,
                                },
                            },
                        })
                            .then(({ data }) => {
                                if (!data?.CheckOut) {
                                    showSnackbar({
                                        title: "Error al realizar Check out",
                                        status: "error",
                                        text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente",
                                    })
                                }
                            })
                            .catch((e) => {
                                showSnackbar({
                                    title: "Error al realizar Check out",
                                    status: "error",
                                    text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente",
                                })
                                console.log(e)
                            })
                            .finally(() => {
                                closePage()
                                setisLoading(false)
                            })
                    }}
                />
            </form>
            <LoaderComponent visible={isLoading} />
        </Screen>
    )
}

export default EndCheckout
