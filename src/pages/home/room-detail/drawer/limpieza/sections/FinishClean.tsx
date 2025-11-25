import { useState } from "react"
import { ListView } from "../../../sections/views/Views"
import CardStaff from "src/shared/components/data-display/card-staff/CardStaff"
import useMiniSnackbar from "src/shared/hooks/useMiniSnackbar"
import { Block, PrimaryButton } from "../../../sections/elements/Elements"
import { useColaborador } from "../../../hooks/colaborador"
import { useRoom, useRoomStore } from "../../../hooks"
import Touchable from "src/shared/components/general/touchable/Touchable"
import { State } from "../../general/index.type"
import { Puestos } from "src/constants/puestos"
import {
    Estados_Habitaciones,
    TiposTarea,
    useActualizar_Colaboradores_TareasMutation,
    useCambiarTareaConEstadoMutation,
} from "src/gql/schema"
import { useProfile } from "src/shared/hooks/useProfile"
import { useDispatch } from "react-redux"
import { toggleRoomDetailsDrawer } from "src/store/navigation/navigationSlice"

const FinishClean = () => {
    const [selected, setValue] = useState<State>({ label: "", value: "", extra: "" })

    const room = useRoom()
    const { usuario_id, hotel_id } = useProfile()
    const { handleFinish } = useRoomStore()
    const [isLoadingConfirmSelectSupervisor, setisLoadingConfirmSelectSupervisor] = useState(false)

    const { data } = useColaborador(Puestos.RECAMARISTA)
    const { showMiniSnackbar } = useMiniSnackbar()
    const [cambiarTareaConEstado] = useCambiarTareaConEstadoMutation()
    const [finalizarTarea] = useActualizar_Colaboradores_TareasMutation()
    const dispatch = useDispatch()

    const handleError = () =>
        showMiniSnackbar({
            title: "Error al asignar habitación a supervisión",
            status: "error",
        })

    const handleErrorPendiente = () => {
        showMiniSnackbar({
            title: "Error al finalizar limpieza",
            text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
            status: "error",
        })
        setisLoadingConfirmSelectSupervisor(false)
    }

    const handleConfirm = async () => {
        if (isLoadingConfirmSelectSupervisor) {
            return
        }
        setisLoadingConfirmSelectSupervisor(true)
        if (selected.value) {
            if (selected.value === "pendiente") {
                try {
                    await finalizarTarea({
                        variables: {
                            datos_tarea: {
                                usuario_id,
                                hotel_id,
                                colaboradores_tareas_ids: room?.colaborador_tareas_sin_finalizar?.map(
                                    (c) => c?.colaborador_tarea_id
                                ),
                                estado: Estados_Habitaciones.SupervisionPendiente,
                            },
                        },
                    })
                    showMiniSnackbar({
                        title: "Habitación pendiente de supervisión",
                        text: `La habitación **${room?.nombre}** quedó **pendiente de supervisión.**`,
                        status: "success",
                    })
                    handleFinish()
                    setisLoadingConfirmSelectSupervisor(false)
                } catch (e) {
                    handleErrorPendiente()
                    console.log(e)
                }
            } else {
                const descripcion = `Supervisión de la habitación ${room?.nombre}`
                try {
                    cambiarTareaConEstado({
                        variables: {
                            switch_task_with_room_state_input: {
                                tarea_id: room?.colaborador_tareas_sin_finalizar?.[0]?.tarea_id,
                                hotel_id,
                                // Colaborador a asignar tarea
                                colaborador_id: [selected.value],
                                colaborador_tarea_id: room?.colaborador_tareas_sin_finalizar?.map(
                                    (c) => c?.colaborador_tarea_id
                                ),
                                habitacion_id: room?.habitacion_id,
                                // Estado a cambiar
                                estado_habitacion: Estados_Habitaciones.Supervision,
                                tarea: {
                                    descripcion: descripcion,
                                    nombre: "Supervisión de habitación",
                                    puesto_id: selected.extra || "",
                                    tipo: TiposTarea.Supervision,
                                },
                                usuario_id,
                            },
                        },
                    }).then(() => {
                        showMiniSnackbar({
                            title: "Habitación en supervisión",
                            text: `La **habitación ${room?.nombre}** está en **supervisión** por **${selected.label}.**`,
                            status: "success",
                        })
                        dispatch(toggleRoomDetailsDrawer(false))
                    })
                } catch (e) {
                    handleError()
                    console.log(e)
                }
            }
        }
    }

    return (
        <ListView title="Selecciona al personal para la supervisión de limpieza" subtitle={""}>
            <div style={{ height: "calc(100% - 98px)" }}>
                <Touchable
                    style={{ height: 66, padding: "0 16px", display: "flex", alignItems: "center" }}
                    active={selected.value === "pendiente"}
                    onClick={() => setValue({ label: "", value: "pendiente" })}
                >
                    <span style={{ color: "var(--white", fontSize: 16, fontWeight: 600 }}>
                        {"Pendiente de supervisión"}
                    </span>
                </Touchable>
                <p className="detalle-h-view__subtitle" style={{ margin: "24px 0", fontWeight: 400 }}>
                    {"Personal disponible"}
                </p>
                <Block
                    list
                    scroll
                    className="animante__opacity-transform__ease"
                    style={{ height: "calc(100% - 220px)", marginBottom: 24 }}
                >
                    {data?.map(
                        (
                            {
                                nombre = "",
                                colaborador_id = "",
                                ultima_habitacion = "",
                                tiempo_disponible = "",
                                foto = "",
                                puesto_id = "",
                            },
                            index
                        ) => {
                            return (
                                <CardStaff
                                    key={index}
                                    name={nombre}
                                    description={`Disponible desde hace: ${tiempo_disponible}`}
                                    text={`Última habitación asignada: ${ultima_habitacion}`}
                                    picture={foto}
                                    active={selected.value === colaborador_id}
                                    onClick={() =>
                                        setValue({
                                            label: `${nombre}`,
                                            value: colaborador_id,
                                            extra: puesto_id || "",
                                        })
                                    }
                                />
                            )
                        }
                    )}
                </Block>
                {true && <PrimaryButton text="Aceptar" onClick={handleConfirm} />}
            </div>
        </ListView>
    )
}

export default FinishClean
