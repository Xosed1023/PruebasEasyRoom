import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Screen from "src/shared/components/layout/screen/Screen"
import LayoutFree from "src/pages/home/room-detail/sections/layout-free/LayoutFree"
import Dropdown from "src/shared/components/forms/selelct-dropdown/Dropdown"
import { useRoomStore } from "../../hooks"
import { useSelectedRoom } from "../../hooks/selected"
import { useColaborador } from "../../hooks/colaborador"
import { useRoomDarwer } from "../../hooks/darwer"
import useSnackbar from "src/shared/hooks/useSnackbar"
import { options } from "./FreeRoomMantenimiento.constants"
import { useCleaningTypes } from "../../hooks/limpieza"
import { Puestos } from "src/constants/puestos"
import {
    Estados_Habitaciones,
    TiposLimpiezas,
    useCambiarTareaConEstadoMutation,
    useActualizar_Colaboradores_TareasMutation,
    TiposTarea,
} from "src/gql/schema"
import "./FreeRoomMantenimiento.css"
import { useProfile } from "src/shared/hooks/useProfile"
import LockRoom from "../../Modals/LockRoom/LockRoom"
import MultipleSelectDropdown from "src/shared/components/forms/MultipleSelectDropdown/MultipleSelectDropdown"
import useLoadingState from "src/shared/hooks/useLoadingState"
import LoaderComponent from "src/shared/components/layout/loader/Loader"
import { assignColaborador } from "../../helpers/colaborador"
import { usePuestos } from "../../hooks/usePuestos"

type Selection = {
    personal: { label: string; value: string }[]
    type: TiposLimpiezas | ""
}

interface Errors {
    personal: boolean
    type: boolean
    reasonBlock: boolean
}

const errorInitialValue: Errors = {
    personal: false,
    type: false,
    reasonBlock: false,
}

function FreeRoomMantenimiento(): JSX.Element {
    const [value, setValue] = useState<string>(options[0].key)
    const [selection, setSelection] = useState<Selection>({ personal: [], type: "" })
    const [error, setError] = useState<Errors>(errorInitialValue)
    const { usuario_id, hotel_id } = useProfile()

    const navigate = useNavigate()

    const room = useSelectedRoom()
    const { handleFinish } = useRoomStore()
    const [finalizarTarea] = useActualizar_Colaboradores_TareasMutation()
    const { isLoading, isLoadingDelayed, toggleIsLoading } = useLoadingState()
    const [isLockRoomModalOpen, setIsLockRoomModalOpen] = useState(false)
    const [cambiarTareaConEstado] = useCambiarTareaConEstadoMutation()
    const puestos = usePuestos()

    const { showSnackbar } = useSnackbar()
    const { onClose } = useRoomDarwer()
    const cleaningTypes = useCleaningTypes()

    const onFinished = () =>
        handleFinish(() => {
            onClose()
            navigate("/u")
            toggleIsLoading({ value: false })
        })

    const { data: camaristasData } = useColaborador(Puestos.RECAMARISTA)
    const { data: supervisoresData } = useColaborador(Puestos.SUPERVISOR)

    const personalDisponible = [
        ...(camaristasData || []).map((r) => ({ ...r, puesto: "Camarista" })),
        ...(supervisoresData || []).map((r) => ({
            ...r,
            puesto: "Supervisor",
        })),
    ]

    const handleWrap = async (callback: () => void) => {
        callback()
    }

    const handleSucia = async () => {
        try {
            await finalizarTarea({
                variables: {
                    datos_tarea: {
                        colaboradores_tareas_ids: room?.colaborador_tareas_sin_finalizar?.map(
                            (c) => c?.colaborador_tarea_id
                        ),
                        habitacion_id: room.habitacion_id,
                        usuario_id,
                        hotel_id,
                        estado: Estados_Habitaciones.Sucia,
                    },
                },
            })
            showSnackbar({
                title: "Habitación sucia",
                text: `La habitación **${room?.nombre}** pasó de **mantenimiento** a **sucia.**`,
                status: "success",
            })
            onFinished()
        } catch (e) {
            showSnackbar({
                title: "Error al pasar habitación a sucia",
                status: "error",
            })
            console.log(e)
        }
    }

    const handleLimpieza = async () => {
        try {
            const colaborador = personalDisponible.find(
                ({ colaborador_id }) => colaborador_id === selection.personal[0].value
            )

            const description = `Limpieza de la habitación ${room?.nombre}`
            if (!room?.colaborador_tareas_sin_finalizar) {
                assignColaborador({
                    datos_tarea: {
                        nombre: "Limpieza de habitación",
                        descripcion: "Limpieza de habitación",
                        puesto_id: puestos.find((p) => p?.nombre === Puestos.RECAMARISTA)?.puesto_id || "",
                        tipo: TiposTarea.Limpieza,
                    },
                    datos_colaborador_tarea: {
                        colaborador_ids: selection.personal.map((v) => v.value),
                        descripcion_tarea: "Limpieza de habitación",
                        habitacion_id: room?.habitacion_id,
                        tipo_limpieza: selection.type as TiposLimpiezas,
                    },
                    usuario_id,
                    hotel_id,
                    estadoHabitacion: Estados_Habitaciones.Limpieza,
                })
            } else {
                await cambiarTareaConEstado({
                    variables: {
                        switch_task_with_room_state_input: {
                            tarea_id: room?.colaborador_tareas_sin_finalizar?.[0]?.tarea_id,
                            hotel_id,
                            colaborador_id: selection.personal.map((v) => v.value),
                            colaborador_tarea_id: room?.colaborador_tareas_sin_finalizar?.map(
                                (c) => c?.colaborador_tarea_id
                            ),
                            habitacion_id: room?.habitacion_id,
                            estado_habitacion: Estados_Habitaciones.Limpieza,
                            tarea: {
                                nombre: "Limpieza de habitación",
                                descripcion: description,
                                puesto_id: colaborador?.puesto_id || "",
                                tipo: TiposTarea.Limpieza,
                            },
                            usuario_id,
                            tipo_limpieza: selection.type as TiposLimpiezas,
                        },
                    },
                })
            }
            showSnackbar({
                title: `Limpieza de ${room?.nombre}`,
                text: `**${colaborador?.nombre}** comenzará con la limpieza de la habitación **${room?.nombre}.**`,
                status: "success",
            })
            onFinished()
        } catch (e) {
            showSnackbar({
                title: "Error al asignar habitación a limpieza",
                status: "error",
            })
            console.log(e)
            toggleIsLoading({ value: false })
        }
    }

    const handleBloqueada = async () => {
        setIsLockRoomModalOpen(true)
    }

    const handleConfirm = () => {
        if (isLoadingDelayed) {
            return
        }
        if (value === options[0].key) {
            toggleIsLoading({ value: true })
            handleWrap(handleSucia)
        } else if (value === options[1].key) {
            if (selection.personal && selection.type) {
                toggleIsLoading({ value: true })
                handleWrap(handleLimpieza)
            } else if (!selection.personal.length && selection.type) {
                setError((e) => ({ ...e, personal: true }))
            } else if (!selection.type && selection.personal.length) {
                setError((e) => ({ ...e, type: true }))
            } else {
                setError((e) => ({ ...e, type: true, personal: true }))
            }
        } else if (value === options[2].key) {
            handleBloqueada()
        }
    }

    return (
        <Screen title={""} close onClose={() => navigate(-1)}>
            <LayoutFree
                className="free-room-mantenimiento"
                value={value}
                title={
                    <>
                        {"Después de concluir el mantenimiento"}
                        <br />
                        {`¿Qué estado deseas asignar a la habitación ${room?.numero_habitacion}?`}
                    </>
                }
                options={options}
                onChange={(value) => {
                    setValue(value)
                    setSelection({ personal: [], type: "" })
                    setError(errorInitialValue)
                }}
                onClick={handleConfirm}
            >
                {value === options[1].key ? (
                    <>
                        <div className="free-room-mantenimiento__select">
                            <MultipleSelectDropdown<{
                                label: string
                                value: string
                            }>
                                editable={true}
                                style={{ marginBottom: 6 }}
                                icon="userFilled"
                                maxSelections={4}
                                errorHintText={error.personal ? "Selecciona una camarista" : undefined}
                                value={selection.personal}
                                label="Camaristas disponibles"
                                placeholder="Selecciona una camarista"
                                onChange={(value) => {
                                    setSelection((s) => ({
                                        ...s,
                                        personal: value.map((item) => ({ label: item.label, value: item.value })),
                                    }))
                                    if (value?.length > 0) {
                                        return setError((e) => ({ ...e, personal: false }))
                                    }
                                    return setError((e) => ({ ...e, personal: true }))
                                }}
                                options={personalDisponible.map((r) => ({
                                    withCheckbox: true,
                                    withPhoto: true,
                                    value: { label: r.nombre, value: r.colaborador_id },
                                    label: `${r.nombre}`,
                                    photoSrc: r.foto,
                                }))}
                            />
                        </div>
                        <div className="free-room-mantenimiento__select" style={{ marginBottom: 6 }}>
                            <Dropdown
                                value={selection.type}
                                onClick={({ value = "" }) => {
                                    setSelection({ ...selection, type: value })
                                    if (value) {
                                        return setError((e) => ({ ...e, type: false }))
                                    }
                                    return setError((e) => ({ ...e, type: true }))
                                }}
                                label="Tipo de limpieza"
                                placeholder="Selecciona una opción"
                                icon="broom"
                                options={cleaningTypes.map(({ value, label = "", minutes = "" }) => {
                                    return {
                                        label: `${label} - ${minutes}`,
                                        value,
                                    }
                                })}
                                iconInOptions={false}
                                errorHintText={error.type ? "Selecciona un tipo " : ""}
                            />
                        </div>
                    </>
                ) : (
                    <div className="free-room-mantenimiento__space" />
                )}
                <LockRoom
                    isOpen={isLockRoomModalOpen}
                    onClose={() => {
                        setIsLockRoomModalOpen(false)
                    }}
                    onConfirmed={onFinished}
                />
            </LayoutFree>
            <LoaderComponent visible={isLoading} />
        </Screen>
    )
}

export default FreeRoomMantenimiento
