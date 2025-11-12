import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Screen from "src/shared/components/layout/screen/Screen"
import LayoutFree from "src/pages/home/room-detail/sections/layout-free/LayoutFree"
import Dropdown from "src/shared/components/forms/selelct-dropdown/Dropdown"
import { useRoom, useRoomStore } from "../../../hooks"
import { useColaborador } from "../../../hooks/colaborador"
import { useRoomDarwer } from "../../../hooks/darwer"
import useSnackbar from "src/shared/hooks/useSnackbar"
import {
    Estados_Habitaciones,
    TiposTarea,
    useActualizar_Colaboradores_TareasMutation,
    useCambiarTareaConEstadoMutation,
} from "src/gql/schema"
import "./CleanRoomSupervision.css"
import { useDispatch } from "react-redux"
import { client } from "src/graphql"
import { GET_ROOM } from "src/pages/home/graphql/queries/rooms.query"
import { selectRoom } from "src/store/rooms/roomsSlice"
import { Puestos } from "src/constants/puestos"
import { useProfile } from "src/shared/hooks/useProfile"

type Selection = {
    personal: string
    reasons: string
}

const options = [
    {
        label: "Pendiente de supervisión",
        icon: "SearchWatch",
        key: "supervision_pendiente",
    },
    {
        label: "Supervisar",
        icon: "Search",
        key: "supervision",
    },
    {
        label: "Preparada",
        icon: "check",
        key: "preparada",
    },
    {
        label: "Ponerla a la venta",
        icon: "moneyDollarCircleLine",
        key: "a_la_venta",
    },
]

function CleanRoomSupervision(): JSX.Element {
    const [value, setValue] = useState<string>(options[0].key)
    const [selection, setSelection] = useState<Selection>({ personal: "", reasons: "" })
    const [error, setError] = useState<boolean>(false)
    const { habitacion_id } = useParams()
    const [cambiarTareaConEstado] = useCambiarTareaConEstadoMutation()
    const dispatch = useDispatch()
    const { usuario_id } = useProfile()
    const getRoom = async () => {
        const { data } = await client.query({
            query: GET_ROOM,
            variables: {
                habitacion_id,
                usuario_id,
            },
            fetchPolicy: "no-cache",
        })
        if (!data.habitacion) {
            navigate("/u")
        }
        dispatch(selectRoom(data.habitacion))
    }

    useEffect(() => {
        getRoom()
    }, [])

    const navigate = useNavigate()

    const room = useRoom()
    const { handleFinish } = useRoomStore()
    const { data: supervisores } = useColaborador(Puestos.SUPERVISOR)
    const [isLoadingHandleConfirm, setisLoadingHandleConfirm] = useState(false)
    const [finalizarTarea] = useActualizar_Colaboradores_TareasMutation()

    const { showSnackbar } = useSnackbar()
    const { onClose } = useRoomDarwer()

    const onFinished = () =>
        handleFinish(() => {
            onClose()
            navigate(-1)
            setisLoadingHandleConfirm(false)
        })

    const handleWrap = async (callback: () => void) => {
        try {
            callback()
        } catch (e) {
            showSnackbar({
                title: "Error al finalizar supervisión",
                status: "error",
            })
            console.log(e)
        }
    }

    const handlePendiente = async () => {
        try {
            finalizarTarea({
                variables: {
                    datos_tarea: {
                        colaboradores_tareas_ids: room?.colaborador_tareas_sin_finalizar?.map(
                            (c) => c?.colaborador_tarea_id
                        ),
                        usuario_id,
                        estado: Estados_Habitaciones.SupervisionPendiente,
                    },
                },
            }).then(({ data }) => {
                if (data) {
                    showSnackbar({
                        title: "Limpieza concluida",
                        text: `La habitación **${room?.nombre}** pasó de pendiente de supervisión`,
                        status: "success",
                    })
                    onFinished()
                } else {
                    showSnackbar({
                        title: "Error al asignar habitación a pendiente de  supervisión",
                        status: "error",
                    })
                }
            })
        } catch (e) {
            showSnackbar({
                title: "Error al asignar habitación a pendiente de  supervisión",
                status: "error",
            })
            setisLoadingHandleConfirm(false)
            console.log(e)
        }
    }

    const handlePreparada = async () => {
        try {
            finalizarTarea({
                variables: {
                    datos_tarea: {
                        colaboradores_tareas_ids: room?.colaborador_tareas_sin_finalizar?.map(
                            (c) => c?.colaborador_tarea_id
                        ),
                        usuario_id,
                        estado: Estados_Habitaciones.Preparada,
                    },
                },
            }).then(({ data }) => {
                if (data) {
                    showSnackbar({
                        title: "Limpieza concluida",
                        text: `La habitación **${room?.nombre}** pasó a preparada`,
                        status: "success",
                    })
                    onFinished()
                } else {
                    showSnackbar({
                        title: "Error al asignar habitación a preparada",
                        status: "error",
                    })
                }
            })
        } catch (e) {
            showSnackbar({
                title: "Error al asignar habitación a preparada",
                status: "error",
            })
            setisLoadingHandleConfirm(false)
            console.log(e)
        }
    }

    const handleVenta = async () => {
        try {
            finalizarTarea({
                variables: {
                    datos_tarea: {
                        colaboradores_tareas_ids: room?.colaborador_tareas_sin_finalizar?.map(
                            (c) => c?.colaborador_tarea_id
                        ),
                        usuario_id,
                        estado: Estados_Habitaciones.ALaVenta,
                    },
                },
            }).then(({ data }) => {
                if (data) {
                    showSnackbar({
                        title: "Habitación a la venta",
                        text: `La habitación **${room?.nombre}** está limpia y lista para venderse.`,
                        status: "success",
                    })
                    onFinished()
                } else {
                    showSnackbar({
                        title: "Error al pasar habitación a la venta",
                        status: "error",
                    })
                }
            })
        } catch (e) {
            showSnackbar({
                title: "Error al pasar habitación a la venta",
                status: "error",
            })
            console.log(e)
        }
    }

    const handleSupervisar = async () => {
        try {
            const colaborador = [...supervisores].find(({ colaborador_id }) => colaborador_id === selection.personal)

            const description = `Supervisión de la habitación ${room?.nombre} de limpieza a supervisión`

            await cambiarTareaConEstado({
                variables: {
                    switch_task_with_room_state_input: {
                        tarea_id: room?.colaborador_tareas_sin_finalizar?.[0]?.tarea_id,
                        estado_habitacion: Estados_Habitaciones.Supervision,
                        habitacion_id: room?.habitacion_id,
                        colaborador_id: [selection.personal],
                        colaborador_tarea_id: room?.colaborador_tareas_sin_finalizar?.map(
                            (c) => c?.colaborador_tarea_id
                        ),
                        tarea: {
                            nombre: "Supervisión de habitación",
                            descripcion: description,
                            puesto_id: colaborador?.puesto_id || "",
                            tipo: TiposTarea.Supervision,
                        },
                        usuario_id,
                    },
                },
            })

            showSnackbar({
                title: "Limpieza concluida",
                text: `La habitación **${room?.nombre}** pasó a supervisión`,
                status: "success",
            })
            onFinished()
        } catch (e) {
            showSnackbar({
                title: "Error al asignar habitación a supervisión",
                status: "error",
            })
            console.log(e)
        }
    }

    const handleConfirm = () => {
        if (isLoadingHandleConfirm) return

        setisLoadingHandleConfirm(true)

        switch (value) {
            case options[0].key:
                handleWrap(handlePendiente)
                break
            case options[1].key:
                if (selection.personal) {
                    handleWrap(handleSupervisar)
                } else {
                    setError(true)
                    setisLoadingHandleConfirm(false)
                }
                break
            case options[2].key:
                handleWrap(handlePreparada)
                break
            case options[3].key:
                handleWrap(handleVenta)
                break
            default:
                handleWrap(handlePendiente)
                break
        }
    }

    return (
        <Screen title={""} close onClose={() => navigate(-1)} className="clean-room-supervision">
            <LayoutFree
                className="free-room-clean-supervisor "
                value={value}
                title={
                    <>
                        {"Después de concluir la limpieza"}
                        <br />
                        {`¿Qué estado deseas asignar a la habitación ${room?.numero_habitacion}?`}
                    </>
                }
                options={options}
                onChange={(value) => {
                    setValue(value)
                    setSelection({ personal: "", reasons: "" })
                    setError(false)
                }}
                onClick={handleConfirm}
            >
                {value === options[1].key ? (
                    <div className="free-room-supervisor__select">
                        <Dropdown
                            value={selection.personal}
                            onClick={({ value = "" }) => setSelection({ ...selection, personal: value })}
                            label="Supervisores disponibles"
                            placeholder="Selecciona una opción"
                            icon="userFilled"
                            options={[...supervisores].map(({ nombre, colaborador_id }) => {
                                return {
                                    label: nombre,
                                    value: colaborador_id,
                                }
                            })}
                            iconInOptions={false}
                            errorHintText={error ? "Selecciona un personal" : ""}
                        />
                    </div>
                ) : (
                    <div className="free-room-supervision__space" />
                )}
            </LayoutFree>
        </Screen>
    )
}

export default CleanRoomSupervision
