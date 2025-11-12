import { useState } from "react"
import { useNavigate } from "react-router-dom"
import cx from "classnames"
import CardStaff from "src/shared/components/data-display/card-staff/CardStaff"
import useMiniSnackbar from "src/shared/hooks/useMiniSnackbar"
import { Puestos } from "src/constants/puestos"
import {
    Estados_Habitaciones,
    TiposTarea,
    useCambiarTareaConEstadoMutation,
    useCambiarTareaEntreColaboradoresMutation,
} from "src/gql/schema"
import { useProfile } from "src/shared/hooks/useProfile"
import useLoadingState from "src/shared/hooks/useLoadingState"
import profileDefault from "src/assets/webp/profile_default.webp"
import LoaderComponent from "src/shared/components/layout/loader/Loader"
import Touchable from "src/shared/components/general/touchable/Touchable"
import { useRoom } from "src/pages/home/room-detail/hooks"
import { useColaborador } from "src/pages/home/room-detail/hooks/colaborador"
import { State } from "../../index.type"
import { useCloseDrawer } from "src/pages/home/room-detail/helpers/useCloseDrawer"
import { assignColaborador } from "src/pages/home/room-detail/helpers/colaborador"
import { ListView } from "src/pages/home/room-detail/sections/views/Views"
import { Block, PrimaryButton, SecondaryButton } from "src/pages/home/room-detail/sections/elements/Elements"
import { usePuestos } from "src/pages/home/room-detail/hooks/usePuestos"
import { EmptyColaborador } from "../Empty"
import Empty from "src/shared/components/data-display/empty/Empty"
import Icon from "src/shared/icons/UserUnfollow"
import "../../index.css"
import "./MaintenanceStaff.css"

const SIN_COLABORADOR = "none"

const MaintenanceStaff = ({
    motivoMantenimiento = "",
    isChangeStaffOnly = false,
}: {
    motivoMantenimiento?: string
    isChangeStaffOnly?: boolean
}) => {
    const navigate = useNavigate()
    const [lvalue, setValue] = useState<State>({ label: "", value: SIN_COLABORADOR, extra: "" })

    const room = useRoom()
    const { data, load } = useColaborador(Puestos.MANTENIMIENTO)
    const puestos = usePuestos()
    const puesto_id = puestos?.find((i) => i?.nombre === Puestos.MANTENIMIENTO)?.puesto_id || ""

    const isVisibleNotColaborador: boolean = isChangeStaffOnly
        ? !!room?.colaborador_tareas_sin_finalizar?.[0]?.colaborador_id
        : true
    const { showMiniSnackbar } = useMiniSnackbar()
    const { usuario_id, turno_hotel_id } = useProfile()

    const [cambiarTareaEntreColaboradores] = useCambiarTareaEntreColaboradoresMutation()
    const [cambioTareaConCambioEstado] = useCambiarTareaConEstadoMutation()

    const { isLoading, toggleIsLoading, isLoadingDelayed } = useLoadingState()

    /*
    const getNombre = () => {
        const mant = room?.ultimos_datos?.ultimo_mantenimiento
        const colabMant = mant?.colaborador

        return mant ? `${colabMant?.nombre} ${colabMant?.apellido_paterno} ${colabMant?.apellido_materno}` : ""
    }*/

    const handleError = () => {
        showMiniSnackbar({
            title: "Error al asignar habitación a mantenimiento",
            status: "error",
        })
    }

    const { closeDrawer } = useCloseDrawer(() => {
        toggleIsLoading({ value: false })
    })

    const handleConfirm = async () => {
        if (isLoading) {
            return
        }
        if (!lvalue.value) {
            return
        }
        toggleIsLoading({ value: true })
        const colaborador_ids = !lvalue.value || lvalue.value === SIN_COLABORADOR ? [] : [lvalue.value]
        
        if (isChangeStaffOnly && room?.colaborador_tareas_sin_finalizar) {
            //const nombre = getNombre()
            cambiarTareaEntreColaboradores({
                variables: {
                    switch_task_btw_colab_input: {
                        sin_personal_asignado: !colaborador_ids.length,
                        tarea_id: room?.colaborador_tareas_sin_finalizar?.[0]?.tarea_id,
                        colaborador_id: colaborador_ids,
                        colaborador_tarea_id: [room?.colaborador_tareas_sin_finalizar?.[0]?.colaborador_tarea_id],
                        descripcion_tarea: room?.colaborador_tareas_sin_finalizar?.[0]?.descripcion_tarea,
                        habitacion_id: room?.habitacion_id,
                        tarea: {
                            descripcion: room?.colaborador_tareas_sin_finalizar?.[0]?.descripcion_tarea,
                            nombre: room?.colaborador_tareas_sin_finalizar?.[0]?.descripcion_tarea,
                            puesto_id:
                                room?.colaborador_tareas_sin_finalizar?.[0]?.colaborador?.colaborador_in_hotel?.[0]
                                    ?.puesto?.puesto_id ||
                                lvalue.extra ||
                                puesto_id ||
                                "",
                        },
                        turno_id: turno_hotel_id,
                        usuario_id,
                    },
                },
            })
                .then(({ data }) => {
                    showMiniSnackbar({
                        title: "Cambio de personal mantenimiento",
                        text: `Cambiaste el personal asignado para el mantenimiento de la habitación **${room?.nombre}**`,
                        status: "success",
                    })
                })
                .catch((e) => {
                    showMiniSnackbar({
                        title: "Error al reasignar personal de mantenimiento",
                        status: "error",
                    })
                    console.log(e)
                })
                .finally(() => {
                    closeDrawer()
                })
            return
        }
        const confirmText =
            !lvalue.value || lvalue.value
                ? `El estado de la habitación **${room?.nombre}** fue actualizado a mantenimiento.`
                : `**${lvalue.label}** comenzará con el mantenimiento de la habitación **${room?.nombre}**`

        if (room?.colaborador_tareas_sin_finalizar?.length) {
            cambioTareaConCambioEstado({
                variables: {
                    switch_task_with_room_state_input: {
                        tarea_id: room?.colaborador_tareas_sin_finalizar?.[0]?.tarea_id,
                        habitacion_id: room?.habitacion_id,
                        colaborador_id: colaborador_ids,
                        colaborador_tarea_id: room?.colaborador_tareas_sin_finalizar?.map(
                            (c) => c?.colaborador_tarea_id
                        ),
                        estado_habitacion: Estados_Habitaciones.Mantenimiento,
                        tarea: {
                            descripcion: motivoMantenimiento,
                            nombre: "Mantenimiento de habitación",
                            puesto_id: lvalue.extra || puesto_id || "",
                            tipo: TiposTarea.Mantenimiento,
                        },
                        usuario_id,
                    },
                },
            })
                .then(() => {
                    showMiniSnackbar({
                        title: "Mantenimiento de habitación",
                        text: confirmText,
                        status: "success",
                    })
                })
                .catch(() => handleError())
                .finally(() => {
                    closeDrawer()
                })
            return
        }

        try {
            await assignColaborador({
                datos_tarea: {
                    nombre: "Mantenimiento de habitación",
                    descripcion: motivoMantenimiento,
                    puesto_id: lvalue.extra || puesto_id || "",
                    tipo: TiposTarea.Mantenimiento,
                },
                datos_colaborador_tarea: {
                    colaborador_ids,
                    descripcion_tarea: motivoMantenimiento || "Mantenimiento de habitación",
                    habitacion_id: room?.habitacion_id,
                },
                usuario_id,
                estadoHabitacion: Estados_Habitaciones.Mantenimiento,
            })
            showMiniSnackbar({
                title: "Mantenimiento de habitación",
                text: confirmText,
                status: "success",
            })
        } catch (e) {
            handleError()
            console.log(e)
        } finally {
            closeDrawer()
        }
    }
    
    return (
        <ListView
            title={
                isChangeStaffOnly
                    ? "Elige una opción para continuar el mantenimiento"
                    : "Asigna tu personal para mantenimiento"
            }
            subtitle="Personal disponible"
            titleStyle={{ width: "80%" }}
            subtitleStyle={{ fontWeight: 400 }}
        >
            {!load ? (
                true ? (
                    <div className="detalle-h-general__mantenance__box">
                        <Block list scroll style={{ alignContent: data.length ? "flex-start" : "initial" }} className={isChangeStaffOnly ? "detalle-h-general__mantenance__block-mg-change" : "detalle-h-general__mantenance__block-mg"}>
                            {data.map(({ nombre = "", colaborador_id = "", puesto_id = "", foto = "" }, index) => (
                                <CardStaff
                                    key={index}
                                    name={nombre}
                                    picture={foto || profileDefault}
                                    onClick={() =>
                                        setValue({
                                            label: `${nombre}`,
                                            value: colaborador_id,
                                            extra: puesto_id || "",
                                        })
                                    }
                                    active={colaborador_id === lvalue.value}
                                />
                            ))}
                            {!data?.length && !isVisibleNotColaborador && 
                                !room?.ultimos_datos?.ultimo_mantenimiento?.colaborador_id 
                                ? (                                     
                                    <Empty
                                        className={"detalle-h-general__mantenance__box-empty"}
                                        theme={"dark"}
                                        title={"No hay personal de mantenimiento disponible"}
                                        icon={"userFilled"}
                                    />
                                    )
                                : (
                                    <Touchable
                                        className={cx("detalle-h-general__mantenance__item")}
                                        theme={"dark"}
                                        active={lvalue.value === SIN_COLABORADOR}
                                        onClick={() =>
                                            setValue({
                                                label: "",
                                                value: SIN_COLABORADOR,
                                                extra: "",
                                            })
                                        }
                                    >
                                        <Icon height={32} width={40} color={"var(--white)"} />
                                        <p className="detalle-h-general__mantenance__item-label">
                                            {"Omitir asignación de personal "}
                                        </p>
                                    </Touchable>
                                )
                            }
                        </Block>
                        {!data ? (
                            <PrimaryButton
                                disabled={!lvalue.value || isLoadingDelayed}
                                text="Asignar a mantenimiento"
                                onClick={handleConfirm}                
                            />
                        ) : (
                            !data?.length && !isVisibleNotColaborador && !room?.ultimos_datos?.ultimo_mantenimiento?.colaborador_id 
                                ? (
                                    <PrimaryButton
                                        text="Administrar personal"
                                        onClick={() => navigate("/u/personal")}
                                        style={{ marginTop: 62 }}
                                    />
                                ) : (
                                    <>
                                        <PrimaryButton
                                            disabled={!lvalue.value || isLoadingDelayed}
                                            text="Asignar a mantenimiento"
                                            style={{ marginBottom: 12 }}
                                            onClick={handleConfirm}
                                            
                                        />
                                        <SecondaryButton
                                            text="Administrar personal"
                                            onClick={() => navigate("/u/personal")}
                                        />
                                    </>
                            )
                        )}
                    </div>
                ) : (
                    <EmptyColaborador
                        title="Sin personal de mantenimiento disponible"
                        className="detalle-h-general__mantenance__box"
                    />
                )
            ) : null}
            <LoaderComponent visible={isLoading} />
        </ListView>
    )
}

export default MaintenanceStaff
